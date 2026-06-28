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
use App\Models\Voucher;
use App\Models\VoucherUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
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
    $session_id = $request->get('session_id');

    $orders = Order::where('stripe_session_id', $session_id)
        ->with('vendor', 'orderItems.product')
        ->get();

    if ($orders->count() === 0) {
        abort(404);
    }

    foreach ($orders as $order) {
        if ($order->user_id !== $user->id) {
            abort(403);
        }
    }

    // ── Clear cart items for this checkout, regardless of webhook timing ──
    $productIds = $orders->flatMap(fn($order) => $order->orderItems->pluck('product_id'))->unique()->values();

    if ($productIds->isNotEmpty()) {
        CartItem::where('user_id', $user->id)
            ->whereIn('product_id', $productIds)
            ->where('saved_for_later', false)
            ->delete();
    }

    // ✅ Referral logic (unchanged)
    if ($user->referred_by && !$user->has_received_referral_bonus) {
        $totalSpent = $user->orders()
            ->where(function ($q) {
                $q->where('status', 'Paid')
                    ->orWhere('payment_status', 'paid');
            })
            ->sum('total_price');

        if ($totalSpent >= 100) {
            Voucher::create([
                'code' => strtoupper(Str::random(10)),
                'type' => 'gift',
                'amount' => 30,
                'discount_type' => 'fixed',
                'remaining_amount' => 30,
                'max_uses' => 1,
                'used_count' => 0,
                'user_id' => $user->referred_by,
                'active' => true,
                'expires_at' => now()->addDays(30),
            ]);

            Voucher::create([
                'code' => strtoupper(Str::random(10)),
                'type' => 'gift',
                'amount' => 30,
                'discount_type' => 'fixed',
                'remaining_amount' => 30,
                'max_uses' => 1,
                'used_count' => 0,
                'user_id' => $user->id,
                'active' => true,
                'expires_at' => now()->addDays(30),
            ]);

            $user->update(['has_received_referral_bonus' => true]);
        }
    }

    // ✅ Voucher generation for "voucher" products (unchanged)
    foreach ($orders as $order) {
        foreach ($order->orderItems as $item) {
            if ($item->product && $item->product->product_type === 'voucher') {
                Voucher::create([
                    'code' => strtoupper(Str::random(12)),
                    'type' => 'gift',
                    'amount' => $item->price,
                    'discount_type' => 'fixed',
                    'remaining_amount' => $item->price,
                    'max_uses' => 1,
                    'used_count' => 0,
                    'user_id' => $user->id,
                    'product_id' => $item->product_id,
                    'active' => true,
                    'expires_at' => now()->addDays(365),
                ]);
            }
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



    public function handle(Request $request)
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
            Log::warning('Stripe webhook signature mismatch: ' . $e->getMessage());
            return response('Invalid signature', 400);
        }

        Log::info('Stripe webhook received: ' . $event->type);

        switch ($event->type) {
            case 'charge.updated':
                try {
                    $charge = $event->data->object;

                    $transactionId = $charge['balance_transaction'] ?? null;
                    $paymentIntent = $charge['payment_intent'] ?? null;
                      $chargeId      = $charge['id'] ?? null;

                    if (!$transactionId || !$paymentIntent) {
                        Log::warning('Missing transactionId or paymentIntent in charge.updated event.');
                        break;
                    }

                    $balanceTransaction = $stripe->balanceTransactions->retrieve($transactionId);
                    $totalAmount = $balanceTransaction['amount'];
                    $stripeFee = 0;

                    foreach ($balanceTransaction['fee_details'] as $feeDetail) {
                        if ($feeDetail['type'] === 'stripe_fee') {
                            $stripeFee = $feeDetail['amount'];
                        }
                    }

                    $platformFeePercent = config('app.platform_fee_pct');

                    $orders = Order::where('payment_intent', $paymentIntent)
                        ->with(['user', 'vendorUser.Vendor', 'orderItems.product'])
                        ->get();

                    if ($orders->isEmpty()) {
                        Log::warning("No orders found for payment_intent: $paymentIntent");
                        break;
                    }

                    foreach ($orders as $order) {
                        $vendorShare = $order->total_price * 100 / $totalAmount;
                        $orderOnlinePaymentCommissionCents = $vendorShare * $stripeFee;
                        $orderOnlinePaymentCommission = $orderOnlinePaymentCommissionCents / 100;
                        $orderWebsitePaymentCommission = (($order->total_price - $orderOnlinePaymentCommission) / 100) * $platformFeePercent;

                        $order->online_payment_comission = $orderOnlinePaymentCommission;
                        $order->website_payment_comission = $orderWebsitePaymentCommission;
                        $order->vendor_subtotal = $order->total_price - $orderOnlinePaymentCommission - $orderWebsitePaymentCommission;
$order->stripe_charge_id = $chargeId;
                        $order->save();

                        Mail::to($order->vendorUser)->send(new NewOrderMail($order));
                    }

                    Mail::to($orders[0]->user)->send(new CheckoutCompleted($orders));
                } catch (\Exception $e) {
                    Log::error('charge.updated handler failed: ' . $e->getMessage());
                }
                break;

            case 'checkout.session.completed':
                $session = $event->data->object;
                $paymentIntent = $session['payment_intent'];

                $paymentMethodType = null;
                try {
                    $paymentIntentObj = $stripe->paymentIntents->retrieve($paymentIntent, [
                         'expand' => ['payment_method', 'latest_charge'],
                    ]);
                    $paymentMethodType = $paymentIntentObj->payment_method->type ?? null;
                     $chargeId          = $paymentIntentObj->latest_charge->id ?? null;
                } catch (\Exception $e) {
                    Log::warning('Could not retrieve payment method type: ' . $e->getMessage());
                }

                $orders = Order::with('orderItems')
                    ->where('stripe_session_id', $session['id'])
                    ->get();

                $productsToDeleteFromCart = [];
                $userId = null;

                foreach ($orders as $order) {
                    $order->payment_intent = $paymentIntent;
                    $order->payment_method = $paymentMethodType;
                    $order->stripe_amount    = $session['amount_total'] / 100;
                     $order->stripe_charge_id = $chargeId;
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

                    $voucherId = $session->metadata->voucher_id ?? null;

                    if ($voucherId) {
                        DB::transaction(function () use ($order, $voucherId) {
                            $voucher = Voucher::lockForUpdate()->find($voucherId);
                            if ($voucher && $voucher->active) {
                                $discountToApply = 0;

                                if ($voucher->type === 'gift' && $voucher->remaining_amount > 0) {
                                    $discountToApply = min($voucher->remaining_amount, $order->total_price);

                                    VoucherUsage::create([
                                        'voucher_id' => $voucher->id,
                                        'user_id' => $order->user_id,
                                        'order_id' => $order->id,
                                        'amount_used' => $discountToApply,
                                    ]);

                                    $voucher->remaining_amount -= $discountToApply;
                                    if ($voucher->remaining_amount <= 0) {
                                        $voucher->remaining_amount = 0;
                                        $voucher->active = false;
                                    }
                                } elseif ($voucher->type === 'promo') {
                                    $discountToApply = min($voucher->amount, $order->total_price);

                                    VoucherUsage::create([
                                        'voucher_id' => $voucher->id,
                                        'user_id' => $order->user_id,
                                        'order_id' => $order->id,
                                        'amount_used' => $discountToApply,
                                    ]);

                                    $voucher->used_count += 1;
                                    if ($voucher->max_uses && $voucher->used_count >= $voucher->max_uses) {
                                        $voucher->active = false;
                                    }
                                }

                                $voucher->save();
                            }
                        });
                    }
                }

                // Gift card vouchers purchased via gift card shop (from the second implementation)
                $metadata = (array) $session->metadata;

                if (!empty($metadata['voucher_ids'])) {
                    $ids = explode(',', $metadata['voucher_ids']);
                    Voucher::whereIn('id', $ids)
                        ->where('stripe_session_id', $session->id)
                        ->where('active', false)
                        ->update(['active' => true]);

                    Log::info('Gift card vouchers activated', ['ids' => $ids]);
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

                return redirect()->route('home')->with('success', 'Stripe onboarding complete and account active!');
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
