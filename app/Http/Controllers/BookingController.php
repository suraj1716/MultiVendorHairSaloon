<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Http\Resources\OrderViewResource;
use App\Models\Booking;
use App\Models\Order;
use App\Services\GoogleCalendarService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\Refund;

use App\services\RefundService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('App/Booking', [
            'bookings' => $user->bookings()->with('product', 'vendor')->get(),
        ]);
    }

    public function history()
    {
        $orders = Auth::user()
            ->orders()
            ->with([
                'orderItems.product.variationTypes.options',
                'orderItems.booking.staff'
            ])
            ->latest()
            ->get();

        return Inertia::render('Booking/BookingHistory', [
            'orders' => OrderViewResource::collection($orders),
        ]);
    }






    public function store(Request $request)
    {
        Log::info('Inside BookingController@store', $request->all());
        try {
            $hasBooking = $request->input('hasBooking') == '1';
            $user = Auth::user();

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            if ($hasBooking) {
                $validated = $request->validate([
                    'booking_date' => 'required|date',
                    'time_slot'    => 'required|string|max:255',
                    'staff_id'     => 'nullable|integer|exists:staff,id',
                    'vendor_id'    => 'required|integer|exists:vendors,user_id', // add this to your form submission
                ]);

                $formattedDate  = \Carbon\Carbon::parse($validated['booking_date'])->format('Y-m-d');
                $normalizedSlot = strtolower(trim($validated['time_slot']));

                // Match the same seat logic as getAvailableSlots
                $vendor     = \App\Models\Vendor::find($validated['vendor_id']);
                $totalSeats = max(1, (int) ($vendor->total_seats ?? 1));

                $bookedCount = Booking::join('orders', 'bookings.order_id', '=', 'orders.id')
                    ->whereDate('bookings.booking_date', $formattedDate)
                    ->whereRaw('LOWER(TRIM(bookings.time_slot)) = ?', [$normalizedSlot])
                    ->where('orders.status', '!=', 'cancelled')
                    ->count();

                if ($bookedCount >= $totalSeats) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Selected slot is already booked. Please choose a different time.'
                    ], 409);
                }

                $booking = Booking::create([
                    'user_id'      => $user->id,
                    'booking_date' => $formattedDate,
                    'time_slot'    => $validated['time_slot'],
                    'staff_id'     => $validated['staff_id'] ?? null,
                ]);

                if ($user->google_access_token) {
                    try {
                        $googleService = new GoogleCalendarService(
                            ['access_token' => $user->google_access_token],
                            $user->google_refresh_token
                        );

                        $bookingDate = \Carbon\Carbon::parse($booking->booking_date)->format('Y-m-d');
                        $startDateTime = (new \DateTime($bookingDate . ' ' . explode(' - ', $booking->time_slot)[0]))->format(\DateTime::RFC3339);
                        $endDateTime   = (new \DateTime($bookingDate . ' ' . explode(' - ', $booking->time_slot)[1]))->format(\DateTime::RFC3339);
                        $event = $googleService->createEvent(
                            'Booking Appointment',
                            "Booking ID: {$booking->id}",
                            $startDateTime,
                            $endDateTime,
                            'Australia/Sydney',
                            null
                        );

                        $booking->google_event_id = $event->id;
                        $booking->save();

                        if ($googleService->newAccessToken) {
                            $user->google_access_token = $googleService->newAccessToken;
                            $user->save();
                        }
                    } catch (\Exception $e) {
                        Log::error('Google Calendar create failed in store(): ' . $e->getMessage());
                    }
                }
            }

            return response()->json(['success' => true, 'message' => 'Booking created successfully']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Booking store failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }

    public function getStaffAvailability(Request $request)
    {
        $request->validate([
            'vendor_id' => 'required|integer',
            'date'      => 'required|date',
            'time_slot' => 'required|string',
        ]);

        $vendorId = $request->input('vendor_id');
        $date     = \Carbon\Carbon::parse($request->input('date'))->format('Y-m-d');
        $timeSlot = strtolower(trim($request->input('time_slot')));

        $staffMembers = \App\Models\Staff::where('vendor_id', $vendorId)
            ->where('is_active', true)
            ->get();

        $bookedStaffIds = DB::table('bookings')
            ->whereDate('booking_date', $date)
            ->whereRaw('LOWER(TRIM(time_slot)) = ?', [$timeSlot])
            ->pluck('staff_id')
            ->toArray();

        $staffList = $staffMembers->map(function ($staff) use ($bookedStaffIds) {
            return [
                'id'        => $staff->id,
                'name'      => $staff->name,
                'available' => !in_array($staff->id, $bookedStaffIds),
            ];
        });

        return response()->json(['staff' => $staffList]);
    }

    public function getAvailableSlots(Request $request)
    {
        $date = $request->input('date');

        if (!$date) {
            if ($request->wantsJson()) {
                return response()->json([
                    'availableSlots' => [],
                    'closedDates' => [],
                    'recurringClosedDays' => [],
                    'businessStart' => null,
                    'businessEnd' => null,
                    'slotIntervalMinutes' => null,
                    'message' => 'Date parameter is missing.'
                ]);
            }

            return Inertia::render('AvailableSlots', [
                'date' => null,
                'availableSlots' => [],
                'closedDates' => [],
                'recurringClosedDays' => [],
                'businessStart' => null,
                'businessEnd' => null,
                'slotIntervalMinutes' => null,
                'message' => 'User not authenticated.'
            ]);
        }

        // Set timezone to Sydney (fallback if not set in config)
        $timezone = config('app.timezone', 'Australia/Sydney');
        $now = now()->timezone($timezone);
        $formattedDate = \Carbon\Carbon::parse($date, $timezone)->format('Y-m-d');

        $user = Auth::user();

        if (!$user) {
            if ($request->wantsJson()) {
                return response()->json([
                    'availableSlots' => [],
                    'closedDates' => [],
                    'recurringClosedDays' => [],
                    'businessStart' => null,
                    'businessEnd' => null,
                    'slotIntervalMinutes' => null,
                    'message' => 'User not authenticated.'
                ]);
            }

            return Inertia::render('AvailableSlots', [
                'date' => null,
                'availableSlots' => [],
                'closedDates' => [],
                'recurringClosedDays' => [],
                'businessStart' => null,
                'businessEnd' => null,
                'slotIntervalMinutes' => null,
                'message' => 'User not authenticated.'
            ]);
        }

        // ── Resolve which vendor's slots to check ──
        // Prefer an explicitly-provided vendor id (used by the "Edit Booking" flow,
        // where the user's cart is empty since they already checked out).
        // Fall back to deriving it from the cart (used by the checkout flow).
        $requestedVendorId = $request->input('vendorId') ?? $request->input('vendor_id');

        if ($requestedVendorId) {
            $appointmentVendorId = $requestedVendorId;
        } else {
            $cartItems = \App\Models\CartItem::where('user_id', $user->id)
                ->with('product.vendor')
                ->get();

            $appointmentVendorId = $cartItems
                ->pluck('product.vendor')
                ->filter(fn($vendor) => $vendor !== null && $vendor->vendor_type->value === \App\Enums\VendorType::APPOINTMENT->value)
                ->pluck('user_id')
                ->unique()
                ->first();
        }

        if (!$appointmentVendorId) {
            if ($request->wantsJson()) {
                return response()->json([
                    'availableSlots' => [],
                    'closedDates' => [],
                    'recurringClosedDays' => [],
                    'businessStart' => null,
                    'businessEnd' => null,
                    'slotIntervalMinutes' => null,
                    'message' => 'No appointment vendor found in cart.'
                ]);
            }

            return Inertia::render('AvailableSlots', [
                'date' => null,
                'availableSlots' => [],
                'closedDates' => [],
                'recurringClosedDays' => [],
                'businessStart' => null,
                'businessEnd' => null,
                'slotIntervalMinutes' => null,
                'message' => 'User not authenticated.'
            ]);
        }

        $vendor = \App\Models\Vendor::find($appointmentVendorId);

        if (!$vendor) {
            return Inertia::render('AvailableSlots', [
                'date' => $formattedDate,
                'availableSlots' => [],
                'closedDates' => [],
                'recurringClosedDays' => [],
                'businessStart' => null,
                'businessEnd' => null,
                'slotIntervalMinutes' => null,
                'message' => 'Vendor not found.'
            ]);
        }

        // Build Carbon instances for business start/end times on that date
        $businessStart = \Carbon\Carbon::parse($formattedDate . ' ' . $vendor->business_start_time, $timezone);
        $businessEnd = \Carbon\Carbon::parse($formattedDate . ' ' . $vendor->business_end_time, $timezone);
        $slotIntervalMinutes = $vendor->slot_interval_minutes;

        // Parse closed dates and recurring closed days from vendor
        $closedDates = is_array($vendor->closed_dates)
            ? $vendor->closed_dates
            : json_decode($vendor->closed_dates ?? '[]', true) ?? [];
        $recurringClosedDays = is_array($vendor->recurring_closed_days)
            ? $vendor->recurring_closed_days
            : json_decode($vendor->recurring_closed_days ?? '[]', true) ?? [];

        $dayOfWeek = \Carbon\Carbon::parse($formattedDate, $timezone)->dayOfWeek;

        // Check if the date is closed
        if (in_array($formattedDate, $closedDates) || in_array($dayOfWeek, $recurringClosedDays)) {
            if ($request->wantsJson()) {
                return response()->json([
                    'availableSlots' => [],
                    'closedDates' => $closedDates,
                    'recurringClosedDays' => $recurringClosedDays,
                    'message' => 'Selected date is not available for booking due to closure.'
                ]);
            }
            return Inertia::render('AvailableSlots', [
                'date' => $formattedDate,
                'availableSlots' => [],
                'closedDates' => $closedDates,
                'recurringClosedDays' => $recurringClosedDays,
                'businessStart' => $businessStart->format('H:i'),
                'businessEnd' => $businessEnd->format('H:i'),
                'slotIntervalMinutes' => $slotIntervalMinutes,
                'message' => 'Selected date is not available for booking due to closure.'
            ]);
        }

        $allSlots = [];
        $isToday = $formattedDate === $now->format('Y-m-d');
        $cutoffTime = $now->copy()->addHours(2);

        $current = $businessStart->copy();

        while ($current->lt($businessEnd)) {
            $end = $current->copy()->addMinutes($slotIntervalMinutes);
            $slotLabel = $current->format('g:i a') . ' - ' . $end->format('g:i a');

            if ($isToday) {
                if ($current->greaterThanOrEqualTo($cutoffTime) && $current->greaterThanOrEqualTo($now)) {
                    $allSlots[] = $slotLabel;
                } else {
                    Log::info("Skipping slot (today, before cutoff or now): {$slotLabel}");
                }
            } else {
                $allSlots[] = $slotLabel;
                Log::info("Including slot (future date): {$slotLabel}");
            }

            $current->addMinutes($slotIntervalMinutes);
        }

        // Fetch booked slots for the date from DB
        $totalSeats = max(1, (int) ($vendor->total_seats ?? 1));
        Log::info("Vendor {$appointmentVendorId} total seats: {$totalSeats}");

        $bookedCounts = DB::table('bookings')
            ->join('orders', 'bookings.order_id', '=', 'orders.id')
            ->whereDate('bookings.booking_date', $formattedDate)
            ->where('orders.status', '!=', 'cancelled')
            ->groupBy('bookings.time_slot')
            ->selectRaw('LOWER(TRIM(bookings.time_slot)) as time_slot, COUNT(*) as booked_count')
            ->pluck('booked_count', 'time_slot')
            ->toArray();

        Log::info("Booked counts per slot for {$formattedDate}: " . json_encode($bookedCounts));

        $availableSlots = array_values(array_filter(
            $allSlots,
            function ($slot) use ($bookedCounts, $totalSeats) {
                $key = strtolower(trim($slot));
                $bookedCount = $bookedCounts[$key] ?? 0;
                $seatsLeft = $totalSeats - $bookedCount;

                if ($seatsLeft <= 0) {
                    Log::info("Slot {$slot} is FULL ({$bookedCount}/{$totalSeats} seats booked)");
                    return false;
                }

                Log::info("Slot {$slot} available ({$seatsLeft}/{$totalSeats} seats left)");
                return true;
            }
        ));

        Log::info("Available slots for {$formattedDate}: " . json_encode($availableSlots));

        if ($request->wantsJson()) {
            return response()->json([
                'availableSlots' => $availableSlots,
                'closedDates' => $closedDates,
                'recurringClosedDays' => $recurringClosedDays,
                'businessStart' => $businessStart->format('H:i'),
                'businessEnd' => $businessEnd->format('H:i'),
                'slotIntervalMinutes' => $slotIntervalMinutes,
                'message' => 'Available slots for selected date.'
            ]);
        }
        return Inertia::render('AvailableSlots', [
            'date' => $formattedDate,
            'availableSlots' => $availableSlots,
            'closedDates' => $closedDates,
            'recurringClosedDays' => $recurringClosedDays,
            'businessStart' => $businessStart->format('H:i'),
            'businessEnd' => $businessEnd->format('H:i'),
            'slotIntervalMinutes' => $slotIntervalMinutes,
            'message' => 'Available slots for selected date.'
        ]);
    }







public function update(Request $request, Booking $booking)
{
    $validated = $request->validate([
        'booking_date' => 'required|date',
        'time_slot' => 'required|string|max:255',
        'staff_id' => 'nullable|integer|exists:staff,id',
    ]);

    // Authorization: user must own booking or vendor
    $vendorUserId = $booking->order?->vendor_user_id;
    $isOwner = $booking->user_id === Auth::id();
    $isVendor = $vendorUserId === Auth::id();

    if (!$isOwner && !$isVendor) {
        abort(403);
    }

    // Customers may only edit a booking once — vendors/admins are exempt
    if ($isOwner && !$isVendor && $booking->edited_at) {
        return redirect()->back()->with('error', 'This booking has already been edited once. Please contact support for further changes.');
    }

    // Update booking details
    $booking->update([
        'booking_date' => $validated['booking_date'],
        'time_slot' => $validated['time_slot'],
        'staff_id' => array_key_exists('staff_id', $validated) ? $validated['staff_id'] : $booking->staff_id,
        'edited_at' => $isOwner && !$isVendor ? now() : $booking->edited_at,
    ]);

    $user = Auth::user();

    // If user has Google token and booking has an event ID, update Google Calendar
    if ($user->google_access_token && $booking->google_event_id) {
        try {
            $googleService = new \App\Services\GoogleCalendarService([
                'access_token' => $user->google_access_token,
                'refresh_token' => $user->google_refresh_token,
            ]);

            $startTime = explode(' - ', $booking->time_slot)[0];
            $endTime = explode(' - ', $booking->time_slot)[1];
            $startDateTime = (new \DateTime($booking->booking_date . ' ' . $startTime))->format(\DateTime::RFC3339);
            $endDateTime = (new \DateTime($booking->booking_date . ' ' . $endTime))->format(\DateTime::RFC3339);

            $googleService->updateEvent(
                $booking->google_event_id,
                'Booking Appointment',
                "Updated Booking ID: {$booking->id}",
                $startDateTime,
                $endDateTime,
                'Australia/Sydney'
            );

            if ($googleService->newAccessToken) {
                $user->google_access_token = $googleService->newAccessToken;
                $user->save();
            }
        } catch (\Exception $e) {
            Log::error('Google Calendar update failed: ' . $e->getMessage());
        }
    }

    if ($request->wantsJson()) {
        return response()->json([
            'message' => 'Booking updated successfully.',
            'booking' => $booking->fresh(),
        ]);
    }

    return redirect()->back()->with('success', 'Booking updated successfully.');
}




    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $order = Order::findOrFail($id);
        if ($booking->user_id !== Auth::id()) {
            abort(403);
        }

        if ($order->status !== 'draft' || $order->status !== 'paid') {
            return redirect()->back()->with('error', 'Only draft and paid bookings can be cancelled.');
        }

        $booking->delete();

        return redirect()->back()->with('success', 'Booking deleted successfully.');
    }


    public function confirm(Booking $booking)
    {
        if ($booking->vendor_id !== Auth::id()) {
            abort(403);
        }

        // $booking->update(['status' => 'confirmed']);

        return redirect()->back()->with('success', 'Booking confirmed.');
    }








  public function cancel(Booking $booking, RefundService $refundService)
{
    $user = Auth::user();
    $order = $booking->order;

    if (!$order || $order->status === 'cancelled') {
        return redirect()->back()->with('error', 'Invalid order for cancellation.');
    }

    // Ownership check — customer can only cancel their own booking
    if ($order->user_id !== $user->id) {
        abort(403);
    }

    // Check if past booking date
    if (now()->gt($booking->booking_date)) {
        return redirect()->back()->with('error', 'Past bookings cannot be cancelled.');
    }

    $hoursUntilBooking = now()->diffInHours($booking->booking_date, false);
    $isFullRefund = $hoursUntilBooking >= 24;
    $refundType = $isFullRefund ? 'full' : 'except_booking_fee';

    // Guard against double-processing
    if ($refundService->hasRefundType($order, 'full') || $refundService->hasRefundType($order, $refundType)) {
        return redirect()->back()->with('error', 'This booking has already been refunded.');
    }

    // Delete Google Calendar event
    if ($booking->google_event_id && $user->google_access_token) {
        try {
            $googleService = new GoogleCalendarService(
                ['access_token' => $user->google_access_token],
                $user->google_refresh_token
            );
            $googleService->deleteEvent($booking->google_event_id);
            if ($googleService->newAccessToken) {
                $user->google_access_token = $googleService->newAccessToken;
                $user->save();
            }
        } catch (\Exception $e) {
            Log::error('Google Calendar delete failed: ' . $e->getMessage());
        }
    }

    try {
        $stripePaymentMethods = ['stripe', 'card', 'link', 'afterpay_clearpay', 'klarna', 'zip'];
        $isStripe = in_array($order->payment_method, $stripePaymentMethods);
        $isManual = in_array($order->payment_method, ['cash', 'eftpos']);

        // Stripe-held portion: full amount (incl. booking fee) if >=24hrs out,
        // otherwise everything except the non-refundable booking fee.
        $refundAmount = match (true) {
            $isStripe && $isFullRefund  => $order->booking
                ? $refundService->refundBookingFeeAndOrder($order)
                : $refundService->refundOrder($order),
            $isStripe && !$isFullRefund => $refundService->refundExcludingBookingFee($order),
            $isManual                   => 0, // manual payments need staff to process
            default                     => 0, // gift-card-only order — nothing charged to Stripe
        };

        // Gift card / voucher portion is always restored in full, regardless of
        // the 24-hour window — the booking fee split only applies to the Stripe amount.
        $voucherRestored = $refundService->restoreVoucherForOrder($order);

        if ($refundAmount <= 0 && $voucherRestored <= 0) {
            return redirect()->back()->with('error', 'Nothing was refunded for this booking.');
        }

        $order->update([
            'status' => OrderStatusEnum::Cancelled->value,
            'refunded_at' => now(),
            'refund_amount' => ($order->refund_amount ?? 0) + $refundAmount,
        ]);

        $refundService->recordRefund($order, $refundType, $refundAmount, reason: 'Customer-initiated booking cancellation');

        $message = $isFullRefund
            ? "Booking cancelled. Full refund of \${$refundAmount} processed"
            : "Booking cancelled within 24 hours — refund of \${$refundAmount} processed (booking fee non-refundable)";

        if ($voucherRestored > 0) {
            $message .= " and \${$voucherRestored} restored to your gift card balance";
        }
        $message .= '.';

        return redirect()->back()->with('success', $message);
    } catch (\Exception $e) {
        Log::error("Cancellation failed for Order #{$order->id}: " . $e->getMessage());
        return redirect()->back()->with('error', 'Cancellation failed.');
    }
}
}
