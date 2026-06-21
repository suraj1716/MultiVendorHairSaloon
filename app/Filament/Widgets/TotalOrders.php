<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Filament\Widgets\StatsOverviewWidget;

class TotalOrders extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalOrders = Order::count();

        $todayOrders = Order::whereDate('created_at', today())->count();

        $paidOrders = Order::where('is_paid', 1)->count();

        return [
            Stat::make('Total Orders', $totalOrders),
            Stat::make("Today's Orders", $todayOrders)
                ->description('Placed today')
                ->color('success'),
            Stat::make('Paid Orders', $paidOrders)
                ->description('Marked as paid')
                ->color('primary'),
        ];
    }
}
