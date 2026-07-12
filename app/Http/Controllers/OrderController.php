<?php

namespace App\Http\Controllers;

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Http\Resources\OrderViewResource;
use App\Models\Order;
use App\Services\RefundService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{

    protected $refundService;

    public function __construct(RefundService $refundService)
    {
        $this->refundService = $refundService;
    }
    public function index()
    {
        $orders = Auth::user()
            ->orders()
            ->where('status', OrderStatusEnum::Paid)
            ->with([
                'orderItems.product.variationTypes.options',
                'booking',
                'vendorUser.vendor',
            ])
            ->latest()
            ->paginate(10);

        return Inertia::render('Order/OrdersHistory', [
            'orders' => OrderViewResource::collection($orders),
        ]);
    }


    public function show($orderId)
    {
        $order = Order::with([
            'orderItems.product',
            'orderItems.booking', // Make sure this line is added
            'vendor.vendor',
            'shippingAddress'
        ])->findOrFail($orderId);

        return new OrderViewResource($order);
    }





    /**
     * Process a full refund for an order (minus booking fee if already refunded).
     */
    public function refund(Order $order)
    {
        if ($order->refunded_at) {
            return back()->withErrors(['error' => 'Already refunded.']);
        }

        try {
            $refundService = app(RefundService::class);

            $stripePaymentMethods = ['stripe', 'card', 'link', 'afterpay_clearpay', 'klarna', 'zip'];

            if (in_array($order->payment_method, $stripePaymentMethods)) {
                if (empty($order->payment_intent)) {
                    return back()->withErrors(['error' => 'Stripe order missing payment intent — cannot refund.']);
                }
                $amount = $order->booking
                    ? $refundService->refundBookingAndOrder($order)
                    : $refundService->refundOrder($order);
            } elseif (in_array($order->payment_method, ['cash', 'eftpos'])) {
                $amount = $refundService->refundManual($order);
            } elseif ($order->payment_method === 'gift_card') {
                $amount = $order->total_price;
                $order->update(['refunded_at' => now(), 'status' =>  OrderStatusEnum::Refunded->value]);
            } else {
                return back()->withErrors(['error' => 'No valid payment method for refund.']);
            }

            // Always restore any voucher amount used on this order, regardless of how the
            // remainder was paid (stripe/cash/eftpos/gift_card).
            $voucherRestored = $refundService->restoreVoucherForOrder($order);

            Log::info("Order #{$order->id} refund returned amount: {$amount}, voucher restored: {$voucherRestored}");

            if ($amount <= 0 && $voucherRestored <= 0) {
                return back()->withErrors(['error' => 'Refund failed — nothing was refunded.']);
            }

            $message = "Refunded \${$amount}";
            if ($voucherRestored > 0) {
                $message .= " and restored \${$voucherRestored} to voucher balance";
            }

            return back()->with('success', $message . ' successfully.');
        } catch (\Exception $e) {
            Log::error("Refund exception for Order #{$order->id}: " . $e->getMessage());
            return back()->withErrors(['error' => 'Refund failed: ' . $e->getMessage()]);
        }
    }
}
