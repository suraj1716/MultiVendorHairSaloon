<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;
use App\Filament\Widgets\TotalSales;
use App\Filament\Widgets\TotalOrders;
use App\Filament\Widgets\BookingStats;
use App\Filament\Widgets\SalesOverTimeChart;
use App\Filament\Widgets\WeeklyBookingTabs;

class Dashboard extends BaseDashboard
{
    protected function getHeaderWidgets(): array
    {
        return [
            TotalSales::class,
            TotalOrders::class,
            BookingStats::class,
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            SalesOverTimeChart::class,
              WeeklyBookingTabs::class,  // Add it here
        ];
    }


}
