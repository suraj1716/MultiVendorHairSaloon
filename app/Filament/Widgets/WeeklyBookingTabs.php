<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget;
use Illuminate\Support\Facades\Log;

class WeeklyBookingTabs extends StatsOverviewWidget
{
    protected static string $view = 'filament.widgets.weekly-booking-tabs';

    public $bookingsByDay;

    public function mount(): void
    {
        $this->bookingsByDay = $this->getBookingsByDay();
    }

   protected function getBookingsByDay()
{
    $startDate = Carbon::today();
    $endDate = $startDate->copy()->addDays(6);

    $bookings = Booking::with([
        'user',
        'vendor',
        'order.orderItems.product',
    ])
    ->whereBetween('booking_date', [$startDate->toDateString(), $endDate->toDateString()])
    ->orderBy('booking_date')
    ->orderBy('time_slot')
    ->get();

    // Debug here:
    Log::info('Bookings count: ' . $bookings->count());

    $grouped = $bookings->groupBy(fn($booking) => Carbon::parse($booking->booking_date)->toDateString());

    $period = collect();
    for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
        $key = $date->toDateString();
        $period[$key] = $grouped->get($key, collect());
    }

    return $period;
}


    protected function getViewData(): array
    {
Log::info('Bookings by day:', $this->bookingsByDay->map(fn($b) => $b->count())->toArray());
        return [
            'bookingsByDay' => $this->bookingsByDay,
        ];
    }
}
