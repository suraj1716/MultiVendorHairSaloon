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

use App\Enums\OrderStatusEnum;
use App\Mail\RefundProcessedForUser;
use App\Mail\RefundProcessedForVendor;
use App\Models\Order;
use App\Models\Vendor;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Stripe\Refund;
use Stripe\Stripe;
use App\Models\VoucherUsage;
use App\Models\Refund as RefundRecord;

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
                'amount' => intval(round($refundAmount * 100)),
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
                'status' => OrderStatusEnum::Refunded->value,
                'is_paid' => false,
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
            'status' => OrderStatusEnum::Refunded->value,
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

        if (!$order->stripe_charge_id && !$order->payment_intent) {
            throw new \Exception("Missing Stripe charge or payment intent for Order #{$order->id}");
        }

        $alreadyRefunded = $order->refund_amount ?? 0;
        $stripeCharged = $order->stripe_amount ?? $order->total_price;

        // Never try to refund more than what's actually left unrefunded
        $remaining = round(min($order->total_price, $stripeCharged) - $alreadyRefunded, 2);

        if ($remaining <= 0) {
            Log::info("Nothing left to refund for Order #{$order->id} (already refunded: {$alreadyRefunded})");
            return 0;
        }

        try {
            Stripe::setApiKey(config('app.stripe_secret_key'));

            $stripeParams = [
                'amount' => intval(round($remaining * 100)),
                'reason' => 'requested_by_customer',
            ];

            if ($order->stripe_charge_id) {
                $stripeParams['charge'] = $order->stripe_charge_id;
            } else {
                $stripeParams['payment_intent'] = $order->payment_intent;
            }

            Refund::create($stripeParams);

            $order->update([
                'refund_amount' => $alreadyRefunded + $remaining,
                'refunded_at' => now(),
                'status' => OrderStatusEnum::Refunded->value,
                'is_paid' => false,
            ]);

            Log::info("Order refund successful: A\$ {$remaining} for Order #{$order->id} (total refunded now: " . ($alreadyRefunded + $remaining) . ")");

            try {
                Mail::to($order->user)->send(new RefundProcessedForUser($order));
                Mail::to($order->vendor->user)->send(new RefundProcessedForVendor($order));
            } catch (\Exception $e) {
                Log::error("Failed to send refund emails: " . $e->getMessage());
            }

            return $remaining;
        } catch (\Exception $e) {
            Log::error("Order refund failed for Order #{$order->id}: " . $e->getMessage());
            throw $e;
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
                    'amount' => intval(round($remainingRefundable * 100)),
                    'reason' => 'requested_by_customer',
                ];

                if ($order->stripe_charge_id) {
                    $stripeParams['charge'] = $order->stripe_charge_id;
                } elseif ($order->payment_intent) {
                    $stripeParams['payment_intent'] = $order->payment_intent;
                } else {
                    throw new \Exception("No Stripe charge or payment intent for Order #{$order->id}");
                }

                $refund = Refund::create($stripeParams);

                $order->refund_amount = $alreadyRefunded + $remainingRefundable;
                $order->total_price = max(0, $order->total_price - $remainingRefundable);
                $order->refunded_at = now();
                $order->refund_id = $refund->id;
                $order->refund_reason = 'Admin refund (partial or full)';
                $order->status =  OrderStatusEnum::Refunded->value;
                $order->is_paid = false;
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



    /**
     * Refund ONLY the booking fee (customer visited & completed service).
     */
    public function refundBookingFeeOnly(Order $order): float
    {
        $booking = $order->booking;
        if (!$booking || $booking->booking_fee_refunded) {
            return 0;
        }

        $bookingFee = $this->getBookingFee($order);
        if ($bookingFee <= 0) {
            return 0;
        }

        try {
            Stripe::setApiKey(config('app.stripe_secret_key'));
            $stripeParams = ['amount' => intval(round($bookingFee * 100)), 'reason' => 'requested_by_customer'];
            $stripeParams[$order->stripe_charge_id ? 'charge' : 'payment_intent']
                = $order->stripe_charge_id ?: $order->payment_intent;

            Refund::create($stripeParams);

            $booking->update([
                'booking_fee_refunded' => true,
                'booking_fee_refund_amount' => $bookingFee,
            ]);
            $order->update([
                'refund_amount' => ($order->refund_amount ?? 0) + $bookingFee,
            ]);

            return $bookingFee;
        } catch (\Exception $e) {
            Log::error("Booking fee only refund failed for Order #{$order->id}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Full refund including booking fee — for a genuine full cancellation.
     */
    public function refundBookingFeeAndOrder(Order $order): float
    {
        return $this->refundOrder($order); // total_price already includes booking fee, so a straight full refund covers both
    }



    public function recordRefund(
        Order $order,
        string $type,
        float $amount,
        string $reason = null,
        bool $isMarker = false,
        float $voucherRestored = 0
    ): void {
        RefundRecord::create([
            'order_id'          => $order->id,
            'type'              => $type,
            'amount'            => $amount,
            'voucher_restored'  => $voucherRestored,
            'reason'            => $reason,
            'is_marker'         => $isMarker,
        ]);
    }

    public function hasRefundType(Order $order, string $type): bool
    {
        return RefundRecord::where('order_id', $order->id)->where('type', $type)->exists();
    }

    /**
     * Total amount already restored to the voucher for this order, across all
     * previous partial/full refund actions. Prevents double-restoring the same
     * voucher usage across multiple refund button clicks.
     */
    protected function alreadyRestoredForOrder(Order $order): float
    {
        return (float) RefundRecord::where('order_id', $order->id)
            ->where('voucher_restored', '>', 0)
            ->sum('voucher_restored');
    }
    public function restoreVoucherForOrder(Order $order): float
{
    $usages = VoucherUsage::where('order_id', $order->id)->get();
    if ($usages->isEmpty()) return 0;

    $alreadyRestored = $this->alreadyRestoredForOrder($order);
    $totalRestored = 0;

    foreach ($usages as $usage) {
        $voucher = $usage->voucher;
        if (!$voucher) continue;

        $remainingRestorable = max(0, $usage->amount_used - $alreadyRestored);
        if ($remainingRestorable <= 0) continue;

        if ($voucher->type === 'gift') {
            // Hard ceiling: never let remaining_amount exceed the voucher's original amount
            $maxAllowed = max(0, $voucher->amount - ($voucher->remaining_amount ?? 0));
            $actuallyRestored = min($remainingRestorable, $maxAllowed);

            $voucher->remaining_amount = ($voucher->remaining_amount ?? 0) + $actuallyRestored;
            if ($voucher->remaining_amount > 0 && !$voucher->active) {
                $voucher->active = true;
            }
        } elseif ($voucher->type === 'promo') {
            $voucher->used_count = max(0, $voucher->used_count - 1);
            $voucher->active = true;
            $actuallyRestored = $remainingRestorable;
        }

        $voucher->save();
        $totalRestored += $actuallyRestored;

        Log::info("Restored voucher #{$voucher->id} by {$actuallyRestored} (capped, ceiling-enforced) for refunded Order #{$order->id}");
    }

    return $totalRestored;
}

  public function restoreVoucherAmountForOrder(Order $order, float $amount): float
{
    if ($amount <= 0) return 0;

    $usage = VoucherUsage::where('order_id', $order->id)->first();
    if (!$usage || !$usage->voucher) return 0;

    $alreadyRestored = $this->alreadyRestoredForOrder($order);
    $remainingRestorable = max(0, $usage->amount_used - $alreadyRestored);
    $amount = min($amount, $remainingRestorable);
    if ($amount <= 0) return 0;

    $voucher = $usage->voucher;

    if ($voucher->type === 'gift') {
        // Hard ceiling: never let remaining_amount exceed the voucher's original amount
        $maxAllowed = max(0, $voucher->amount - ($voucher->remaining_amount ?? 0));
        $amount = min($amount, $maxAllowed);
        if ($amount <= 0) return 0;

        $voucher->remaining_amount = ($voucher->remaining_amount ?? 0) + $amount;
        if ($voucher->remaining_amount > 0 && !$voucher->active) {
            $voucher->active = true;
        }
    } elseif ($voucher->type === 'promo') {
        $voucher->used_count = max(0, $voucher->used_count - 1);
        $voucher->active = true;
    }

    $voucher->save();

    Log::info("Restored A\${$amount} to voucher #{$voucher->id} for Order #{$order->id} (partial, ceiling-enforced)");

    return $amount;
}
}
