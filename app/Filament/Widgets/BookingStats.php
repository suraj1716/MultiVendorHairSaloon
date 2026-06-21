<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Filament\Widgets\StatsOverviewWidget;

class BookingStats extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $total = Booking::count();

        $today = Booking::whereDate('booking_date', today())->count();

        return [
            Stat::make('Total upcoming Bookings', $total),
            Stat::make('Today\'s Bookings', $today)
                ->color('success')
                ->description('Bookings for today'),
        ];
    }
}
