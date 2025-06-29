<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Enums\VendorStatusEnum;
use App\Http\Resources\OrderViewResource;
use App\Mail\CheckoutCompleted;
use App\Mail\NewOrderMail;
use App\Mail\RefundProcessedForUser;
use App\Mail\RefundProcessedForVendor;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Stripe\Account;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Stripe;
use Stripe\StripeClient;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeController extends Controller
{
    public function success(Request $request)
    {
        $user = Auth::user();


        // $user=auth()->user();
        $session_id = $request->get('session_id');

        // $orders=Order::where('stripe_session_id', $session_id)
        // ->get();
        $orders = Order::where('stripe_session_id', $session_id)
            ->with('vendor') // Eager load the vendor relationship
            ->paginate(50);

        if ($orders->count() === 0) {
            abort(404);
        }

        foreach ($orders as $order) {
            if ($order->user_id !== $user->id) {
                abort(403);
            }
        }

        return Inertia::render('Stripe/Success', [
            'orders' => OrderViewResource::collection($orders)->collection->toArray()
        ]);
    }

    public function failure()
    {
        return response()->json(['message' => 'Payment failed.']);
    }

 public function webhook(Request $request)
{
    $stripe = new StripeClient(config('app.stripe_secret_key'));
    $endpointSecret = config('app.stripe_webhook_secret');
    $payload = $request->getContent();
    $sigHeader = $request->header('Stripe-Signature');
    $event = null;

    try {
        $event = Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
    } catch (UnexpectedValueException $e) {
        return response('Invalid payload', 400);
    } catch (SignatureVerificationException $e) {
        return response('Invalid signature', 400);
    }

    switch ($event->type) {
      case 'charge.updated':
    try {
        $charge = $event->data->object;

        $transactionId = $charge['balance_transaction'] ?? null;
        $paymentIntent = $charge['payment_intent'] ?? null;

        if (!$transactionId || !$paymentIntent) {
            Log::warning('Missing transactionId or paymentIntent in charge.updated event.');
            break;
        }

        $balanceTransaction = $stripe->balanceTransactions->retrieve($transactionId);
        $totalAmount = $balanceTransaction['amount']; // in cents
        $stripeFee = 0;

        foreach ($balanceTransaction['fee_details'] as $feeDetail) {
            if ($feeDetail['type'] === 'stripe_fee') {
                $stripeFee = $feeDetail['amount']; // in cents
            }
        }

        $platformFeePercent = config('app.platform_fee_pct');

        $orders = Order::where('payment_intent', $paymentIntent)
            ->with(['user', 'vendorUser.Vendor', 'orderItems.product'])
            ->get();

        if ($orders->isEmpty()) {
            return response('No orders found', 404);
        }

        foreach ($orders as $order) {
            // Calculate vendor share of total charge (stripe totalAmount is in cents)
            $vendorShare = $order->total_price * 100 / $totalAmount;

            // Stripe fee commission portion for this order (in cents)
            $orderOnlinePaymentCommissionCents = $vendorShare * $stripeFee;

            // Convert back to dollars
            $orderOnlinePaymentCommission = $orderOnlinePaymentCommissionCents / 100;

            // Website/platform commission on amount after stripe fee commission
            $orderWebsitePaymentCommission = (($order->total_price - $orderOnlinePaymentCommission) / 100) * $platformFeePercent;

            // Vendor subtotal after all commissions (full total_price includes booking fee)
            $order->online_payment_comission = $orderOnlinePaymentCommission;
            $order->website_payment_comission = $orderWebsitePaymentCommission;
            $order->vendor_subtotal = $order->total_price - $orderOnlinePaymentCommission - $orderWebsitePaymentCommission;

            $order->save();

            Mail::to($order->VendorUser)->send(new NewOrderMail($order));
        }

        Mail::to($orders[0]->user)->send(new CheckoutCompleted($orders));
    } catch (\Exception $e) {
        return response('Webhook error: ' . $e->getMessage(), 500);
    }
    break;


        case 'checkout.session.completed':
            $session = $event->data->object;
            $paymentIntent = $session['payment_intent'];

            $orders = Order::with('orderItems')
                ->where('stripe_session_id', $session['id'])
                ->get();

            $productsToDeleteFromCart = [];
            $userId = null;

            foreach ($orders as $order) {
                $order->payment_intent = $paymentIntent;
                $order->status = OrderStatusEnum::Paid;
                $order->save();

                $userId = $order->user_id;

                $productsToDeleteFromCart = array_merge(
                    $productsToDeleteFromCart,
                    $order->orderItems->pluck('product_id')->toArray()
                );

                foreach ($order->orderItems as $orderItem) {
                    $options = $orderItem->variation_type_option_ids;
                    $product = $orderItem->product;
                    if ($options) {
                        sort($options);
                        $variation = $product->variations()
                            ->where('variation_type_option_ids', $options)
                            ->first();

                        if ($variation && $variation->quantity !== null) {
                            $variation->quantity -= $orderItem->quantity;
                            $variation->save();
                        }
                    } elseif ($product->quantity !== null) {
                        $product->quantity -= $orderItem->quantity;
                        $product->save();
                    }
                }
            }

            if ($userId && !empty($productsToDeleteFromCart)) {
                CartItem::query()
                    ->where('user_id', $userId)
                    ->whereIn('product_id', $productsToDeleteFromCart)
                    ->where('saved_for_later', false)
                    ->delete();
            }

            break;

        case 'refund.created':
            $refund = $event->data->object;
            $paymentIntent = $refund['payment_intent'] ?? null;

            Log::info('Stripe webhook: refund.created');
            Log::info('Refund Event Data', ['payment_intent' => $paymentIntent]);

            if (!$paymentIntent) {
                Log::warning('Refund event missing payment_intent');
                break;
            }

            $order = Order::where('payment_intent', $paymentIntent)
                ->with(['user', 'vendorUser'])
                ->first();

            if (!$order) {
                Log::warning("No order found for payment_intent: $paymentIntent");
                break;
            }

            // Avoid overwriting if admin/user refund already recorded
            if ($order->refunded_at) {
                Log::info("Refund already processed for Order ID {$order->id}");
                break;
            }

            $order->refund_id = $refund['id'];
            $order->refund_amount = $refund['amount'] / 100;
            $order->refunded_at = now();
            $order->refund_reason = $order->refund_reason ?? 'Refund via Stripe webhook';
            $order->save();

            try {
                Mail::to($order->user)->send(new RefundProcessedForUser($order));
                Mail::to($order->vendorUser)->send(new RefundProcessedForVendor($order));
                Log::info("Refund emails sent to user and vendor for order ID {$order->id}");
            } catch (\Exception $e) {
                Log::error("Failed to send refund emails: " . $e->getMessage());
            }

            break;

        default:
            break;
    }

    return response('', 200);
}




    // connect from userprofile
    // public function connect()
    // {
    //     $user = Auth::user();
    //     if (!$user->getStripeAccountId()) {
    //         $user->createStripeAccount(['type' => 'express']);
    //     }

    //     if (!$user->isStripeAccountActive()) {
    //         return redirect($user->getstripeAccountLink());
    //     }

    //     return back()->with('success', 'Your account is already connected');
    // }


    // connect from admin dash board
    public function connect(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $user = Auth::user();

        // Step 1: Create Stripe Account if it doesn't exist
        if (!$user->stripe_account_id) {
            $user->createStripeAccount(['type' => 'express']);

            // After creation, get the latest user record with new stripe_account_id
            $user->refresh();
        }

        // Step 2: Check if onboarding is completed
        if ($user->stripe_account_id) {
            $account = \Stripe\Account::retrieve($user->stripe_account_id);

            if ($account->details_submitted && empty($account->requirements->currently_due)) {
                // ✅ Onboarding complete
                if (!$user->stripe_account_active && $user->charges_enabled) {
                    dd($account->charges_enabled);
                    $user->stripe_account_active = true;
                    $user->save();
                }

                // Optionally approve vendor if linked
                if ($user->vendor && $user->vendor->status !== 'approved') {
                    $user->vendor->status = 'approved';
                    $user->vendor->save();
                }

                return redirect()->route('dashboard')->with('success', 'Stripe onboarding complete and account active!');
            }

            // Step 3: Onboarding not complete → redirect to Stripe onboarding
            $onboardingLink = \Stripe\AccountLink::create([
                'account' => $user->stripe_account_id,
                'refresh_url' => route('stripe.connect'),
                'return_url' => route('stripe.connect'),
                'type' => 'account_onboarding',
            ]);

            return redirect($onboardingLink->url);
        }

        abort(500, 'Unexpected error. Please try again.');
    }
}
