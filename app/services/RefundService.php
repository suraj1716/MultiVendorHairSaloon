<?php

// namespace App\Services;

// use App\Models\Order;
// use Illuminate\Support\Facades\Log;
// use Stripe\Refund;
// use Stripe\Stripe;

// class RefundService
// {
//     /**
//      * Refund the booking fee based on cancellation timing.
//      */
//     public function refundBookingFee(Order $order): float
//     {

//         if (!$order->payment_intent || !$order->booking) return 0;

//         $booking = $order->booking;

//         if ($booking->booking_fee_refunded) {
//             return 0;
//         }

//         $bookingDate = now()->parse($booking->booking_date);
//         $daysBefore = now()->diffInDays($bookingDate, false);

//         $refundAmount = $daysBefore < 1
//             ? $order->booking_fee * 0.5
//             : $order->booking_fee;
//   dd('asdasd',$order->booking_fee);
//         try {
//             Stripe::setApiKey(config('app.stripe_secret_key'));

//             Refund::create([
//                 'payment_intent' => $order->payment_intent,
//                 'amount' => intval($refundAmount * 100),
//             ]);

//             $booking->booking_fee_refunded = true;
//             $booking->booking_fee_refund_amount = $refundAmount;
//             $booking->save();

//                // ✅ Update order totals
//         $order->refund_amount = ($order->refund_amount ?? 0) + $refundAmount;
//         $order->refunded_at = now();
//         $order->total_price = max(0, $order->total_price - $refundAmount); // 💡 Subtract refunded amount

//         $order->save();

//             return $refundAmount;
//         } catch (\Exception $e) {
//             Log::error('Booking fee refund failed: ' . $e->getMessage());
//             return 0;
//         }
//     }

//     public function refundOrder(Order $order): float
//     {

//         dd('refundOrder');
//         if (!$order->payment_intent) return 0;

//         $alreadyRefunded = 0;

//         if ($order->booking && $order->booking->booking_fee_refunded) {
//             $alreadyRefunded = $order->booking->booking_fee_refund_amount ?? 0;
//         }

//         $refundableAmount = $order->total_price - $alreadyRefunded;

//         if ($refundableAmount <= 0) return 0;

//         try {
//             Stripe::setApiKey(config('app.stripe_secret_key'));

//             $refund = Refund::create([
//                 'payment_intent' => $order->payment_intent,
//                 'amount' => intval($refundableAmount * 100),
//             ]);

//             $order->refunded_at = now();
//             $order->refund_id = $refund->id;
//             $order->refund_amount = $refundableAmount;
//             $order->refund_reason = 'Admin full refund minus booking fee';
//             $order->save();

//             return $refundableAmount;
//         } catch (\Exception $e) {
//             Log::error('Full refund failed: ' . $e->getMessage());
//             return 0;
//         }
//     }

// public function refundBookingAndOrder(Order $order): float
// {



//     if (!$order->payment_intent) {
//         return 0;
//     }

//     $totalRefunded = 0;


//     // Step 1: Refund booking fee if not yet refunded
//     if ($order->booking && !$order->booking->booking_fee_refunded) {
//         $bookingRefund = $this->refundBookingFee($order); // e.g., returns 50
//         $totalRefunded += $bookingRefund;
//     }

//     // Step 2: Track already refunded amount (booking or partial)
//     $alreadyRefunded = $order->refund_amount + $totalRefunded ?? 0;

// $remainingRefundable = $order->total_price;
// // total_price is net after partial refunds i.e after user/admin cancels and booking fee is refunded

// if ($remainingRefundable > 0) {
//     try {
//         Stripe::setApiKey(config('app.stripe_secret_key'));

//         $refund = Refund::create([
//             'payment_intent' => $order->payment_intent,
//             'amount' => intval($remainingRefundable * 100),
//         ]);

//         // Update totals
//         $order->refund_amount = $alreadyRefunded + $remainingRefundable;
//         $order->total_price = 0;  // fully refunded now
// dd( $order->total_price);
//         $order->refunded_at = now();
//         $order->refund_id = $refund->id;
//         $order->refund_reason = 'Admin full refund including booking fee';
//         $order->status = 'cancelled';

//         $order->save();
//     } catch (\Exception $e) {
//         Log::error('Full refund failed: ' . $e->getMessage());
//     }
// }


//     return $totalRefunded;
// }



// }




namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Stripe\Refund;
use Stripe\Stripe;

class RefundService
{
    /**
     * Refund the booking fee based on cancellation timing.
     */
    public function refundBookingFee(Order $order): float
    {
        Log::info("Starting booking fee refund for Order #{$order->id}");

        if (!$order->payment_intent || !$order->booking) {
            Log::warning("Missing payment intent or booking for Order #{$order->id}");
            return 0;
        }

        $booking = $order->booking;

        if ($booking->booking_fee_refunded) {
            Log::info("Booking fee already refunded for Booking #{$booking->id}");
            return 0;
        }

        $bookingDate = now()->parse($booking->booking_date);
        $daysBefore = now()->diffInDays($bookingDate, false);

        $refundAmount = $daysBefore < 1
            ? $order->booking_fee * 0.5
            : $order->booking_fee;

        Log::info("Booking refund amount calculated: {$refundAmount} for Order #{$order->id}");

        try {
            Stripe::setApiKey(config('app.stripe_secret_key'));

            Refund::create([
                'payment_intent' => $order->payment_intent,
                'amount' => intval($refundAmount * 100),
            ]);

            $booking->booking_fee_refunded = true;

            $booking->booking_fee_refund_amount = $refundAmount;
            $booking->save();

            // ✅ Update order totals
            $order->refund_amount = ($order->refund_amount ?? 0) + $refundAmount;
            $order->refunded_at = now();
            $order->total_price = max(0, $order->total_price - $refundAmount);
$order->forceFill(['total_price' => $order->total_price]); // force dirtyS
            $order->save();

            Log::info("Booking fee refund successful: A$ {$refundAmount} for Order #{$order->id}");

            return $refundAmount;
        } catch (\Exception $e) {
            Log::error("Booking fee refund failed for Order #{$order->id}: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Refund the rest of the order excluding the booking fee.
     */
    public function refundOrder(Order $order): float
    {
        Log::info("Starting full order refund (minus booking) for Order #{$order->id}");

        if (!$order->payment_intent) {
            Log::warning("Missing payment intent for Order #{$order->id}");
            return 0;
        }

        $alreadyRefunded = 0;

        if ($order->booking && $order->booking->booking_fee_refunded) {
            $alreadyRefunded = $order->booking->booking_fee_refund_amount ?? 0;
        }

        $refundableAmount = $order->total_price - $alreadyRefunded;

        if ($refundableAmount <= 0) {
            Log::info("No remaining refundable amount for Order #{$order->id}");
            return 0;
        }

        try {
            Stripe::setApiKey(config('app.stripe_secret_key'));

            $refund = Refund::create([
                'payment_intent' => $order->payment_intent,
                'amount' => intval($refundableAmount * 100),
            ]);

            $order->refunded_at = now();
            $order->refund_id = $refund->id;
            $order->refund_amount = $refundableAmount;
            $order->refund_reason = 'Admin full refund minus booking fee';
            $order->save();

            Log::info("Order refund (minus booking fee) successful: A$ {$refundableAmount} for Order #{$order->id}");

            return $refundableAmount;
        } catch (\Exception $e) {
            Log::error("Full order refund failed for Order #{$order->id}: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Refund both booking fee and remaining order amount.
     */
   public function refundBookingAndOrder(Order $order): float
{
    Log::info("Initiating full refund including booking fee for Order #{$order->id}");

    if (!$order->payment_intent) {
        Log::warning("Missing payment intent on Order #{$order->id}");
        return 0;
    }

    $totalRefunded = 0;

    // Step 1: Refund booking fee if applicable
    if ($order->booking && !$order->booking->booking_fee_refunded) {
        $bookingRefund = $this->refundBookingFee($order);
        $totalRefunded += $bookingRefund;
        Log::info("Booking refund processed: A$ {$bookingRefund}");
    }

    // Step 2: Refund remaining order amount (item or other fees)
    $alreadyRefunded = $order->refund_amount ?? 0;
    $remainingRefundable = $order->total_price;

    Log::info("Remaining refundable amount: A$ {$remainingRefundable} for Order #{$order->id}");

    if ($remainingRefundable > 0) {
        try {
            Stripe::setApiKey(config('app.stripe_secret_key'));

            $refund = Refund::create([
                'payment_intent' => $order->payment_intent,
                'amount' => intval($remainingRefundable * 100),
            ]);

            $order->refund_amount = $alreadyRefunded + $remainingRefundable;
            $order->total_price = max(0, $order->total_price - $remainingRefundable);
            $order->refunded_at = now();
            $order->refund_id = $refund->id;
            $order->refund_reason = 'Admin refund (partial or full)';
            $order->status = 'cancelled';
            $order->save();

            Log::info("Refund successful for Order #{$order->id}. New total: {$order->total_price}");

            // Add refunded item amount to totalRefunded
            $totalRefunded += $remainingRefundable;

        } catch (\Exception $e) {
            Log::error("Refund failed for Order #{$order->id}: " . $e->getMessage());
        }
    }

    return $totalRefunded;
}

}
