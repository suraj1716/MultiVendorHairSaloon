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
//     public function refundExcludingBookingFee(Order $order): float
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
//         $bookingRefund = $this->refundExcludingBookingFee($order); // e.g., returns 50
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

use App\Mail\RefundProcessedForUser;
use App\Mail\RefundProcessedForVendor;
use App\Models\Order;
use App\Models\Vendor;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Stripe\Refund;
use Stripe\Stripe;

class RefundService
{
    private function getBookingFee(Order $order): float
    {
        $vendor = Vendor::find($order->vendor_user_id);
        return $vendor?->booking_fee ?? 0;
    }

    /**
     * Refund booking fee (total - booking_fee)
     */
    public function refundExcludingBookingFee(Order $order): float
    {
        Log::info("Starting booking fee refund for Order #{$order->id}");

        if (!$order->payment_intent) {
            Log::warning("Missing payment intent for Order #{$order->id}");
            return 0;
        }

        // Get booking from order items
        $booking = $order->booking;

        if (!$booking) {
            Log::warning("No booking found for Order #{$order->id}");
            return 0;
        }

        if ($booking->booking_fee_refunded) {
            Log::info("Booking fee already refunded for Booking #{$booking->id}");
            return 0;
        }

        // Get fee from vendor
        $bookingFee = $this->getBookingFee($order);

        if ($bookingFee <= 0) {
            Log::info("No booking fee to refund for Order #{$order->id}");
            return 0;
        }

        // Calculate refund: total_price - booking_fee
        $refundAmount = $order->total_price - $bookingFee;

        if ($refundAmount <= 0) {
            Log::warning("Refund amount is zero or negative for Order #{$order->id}");
            return 0;
        }

        Log::info("Booking refund amount: A\$ {$refundAmount} (total: {$order->total_price} - fee: {$bookingFee})");

        try {
            Stripe::setApiKey(config('app.stripe_secret_key'));

            $stripeParams = [
                'amount' => intval($refundAmount * 100),
                'reason' => 'requested_by_customer',
            ];

            if ($order->stripe_charge_id) {
                $stripeParams['charge'] = $order->stripe_charge_id;
            } elseif ($order->payment_intent) {
                $stripeParams['payment_intent'] = $order->payment_intent;
            } else {
                throw new \Exception("No Stripe charge or payment intent for Order #{$order->id}");
            }

            Refund::create($stripeParams);

            // Mark booking fee as refunded
            $booking->update([
                'booking_fee_refunded' => true,
                'booking_fee_refund_amount' => $refundAmount,
            ]);

            // Update order
            $order->update([
                'refund_amount' => ($order->refund_amount ?? 0) + $refundAmount,
                'refunded_at' => now(),
                'status' => 'refunded',
            ]);

            Log::info("Booking fee refund successful: A\$ {$refundAmount} for Order #{$order->id}");

            return $refundAmount;
        } catch (\Exception $e) {
            Log::error("Booking fee refund failed for Order #{$order->id}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Manual refund for cash/EFTPOS orders
     */
    public function refundManual(Order $order): float
    {
        Log::info("Starting manual refund for Order #{$order->id}");

        $bookingFee = $this->getBookingFee($order);
        $refundAmount = $order->total_price - $bookingFee;

        if ($refundAmount <= 0) {
            Log::info("No refundable amount for Order #{$order->id}");
            return 0;
        }

        $order->update([
            'refund_amount' => $refundAmount,
            'refunded_at' => now(),
            'refund_reason' => 'Manual refund (' . $order->payment_method . ')',
            'status' => 'refunded',
            'is_paid' => false,
        ]);

        // Mark booking fee as refunded
        $booking = $order->booking;
        if ($booking && !$booking->booking_fee_refunded) {
            $booking->update([
                'booking_fee_refunded' => true,
                'booking_fee_refund_amount' => $bookingFee,
            ]);
        }

        Log::info("Manual refund successful: A\$ {$refundAmount} for Order #{$order->id}");

        return $refundAmount;
    }

    /**
     * Full refund via Stripe (total - booking_fee)
     */
    public function refundOrder(Order $order): float
    {
        Log::info("Starting full order refund for Order #{$order->id}");

        if (!$order->stripe_charge_id) {
            throw new \Exception("Missing Stripe charge ID for Order #{$order->id}");
        }

        $bookingFee = $this->getBookingFee($order);
        // What was actually charged to Stripe
        $stripeCharged = $order->stripe_amount ?? $order->total_price;

        // Can't refund more than what Stripe received
        $refundAmount = min($order->total_price, $stripeCharged);


        if ($refundAmount <= 0) {
            Log::info("No refundable amount for Order #{$order->id}");
            return 0;
        }

        try {
            Stripe::setApiKey(config('app.stripe_secret_key'));

            $stripeParams = [
                'amount' => intval($refundAmount * 100),
                'reason' => 'requested_by_customer',
            ];

            if ($order->stripe_charge_id) {
                $stripeParams['charge'] = $order->stripe_charge_id;
            } elseif ($order->payment_intent) {
                $stripeParams['payment_intent'] = $order->payment_intent;
            } else {
                throw new \Exception("No Stripe charge or payment intent for Order #{$order->id}");
            }

            Refund::create($stripeParams);

            $order->update([
                'refund_amount' => $refundAmount,
                'refunded_at' => now(),
                'status' => 'refunded',
            ]);

            Log::info("Order refund successful: A\$ {$refundAmount} for Order #{$order->id}");

            // Send emails
            try {
                Mail::to($order->user)->send(new RefundProcessedForUser($order));
                Mail::to($order->vendor->user)->send(new RefundProcessedForVendor($order));
            } catch (\Exception $e) {
                Log::error("Failed to send refund emails: " . $e->getMessage());
            }

            return $refundAmount;
        } catch (\Exception $e) {
            Log::error("Order refund failed for Order #{$order->id}: " . $e->getMessage());
            throw $e;
        }
    }
    /**
     * Refund the rest of the order excluding the booking fee.
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

            return redirect()->back()->with('success', "Successfully refunded \${$amount} for order #{$order->id}.");
        } catch (\Exception $e) {
            Log::error("Admin refund failed for Order #{$order->id}: " . $e->getMessage());
            return redirect()->back()->with('error', 'Refund failed. Please check logs for details.');
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
            $bookingRefund = $this->refundExcludingBookingFee($order);
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
                $stripeParams = [
                    'amount' => intval($remainingRefundable * 100),
                    'reason' => 'requested_by_customer',
                ];

                if ($order->stripe_charge_id) {
                    $stripeParams['charge'] = $order->stripe_charge_id;
                } elseif ($order->payment_intent) {
                    $stripeParams['payment_intent'] = $order->payment_intent;
                } else {
                    throw new \Exception("No Stripe charge or payment intent for Order #{$order->id}");
                }

                Refund::create($stripeParams);


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
