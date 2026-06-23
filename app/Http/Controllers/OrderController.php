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
        if (!$order->payment_intent) {
            return redirect()->back()->with('error', 'This order was not paid online or has no payment intent.');
        }

        if ($order->refunded_at) {
            return redirect()->back()->with('error', 'This order has already been refunded.');
        }

        try {
            $amount = $this->refundService->refundOrder($order);

            if ($amount <= 0) {
                return redirect()->back()->with('error', 'No refundable amount left on this order.');
            }

            // 🟢 Update refund details
            $order->refund_amount = $amount;
            $order->refunded_at = now();

            // 🟢 Subtract refund from total price, ensuring it doesn't go negative
            $order->total_price = max(0, $order->total_price - $amount);

            // (Optional) update status and reason
            $order->status = 'cancelled';
            $order->refund_reason = 'Admin refund via panel';

            $order->save();

            return redirect()->back()->with('success', "Successfully refunded \${$amount} for order #{$order->id}.");
        } catch (\Exception $e) {
            Log::error("Admin refund failed for Order #{$order->id}: " . $e->getMessage());
            return redirect()->back()->with('error', 'Refund failed. Please check logs for details.');
        }
    }
}
