<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Filament\Widgets\StatsOverviewWidget;

class TotalSales extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalSales = Order::where('is_paid', 1)->sum('total_price');

        $todaySales = Order::where('is_paid', 1)
            ->whereDate('created_at', today())
            ->sum('total_price');

        $monthlySales = Order::where('is_paid', 1)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_price');

        return [
            Stat::make('Total Sales', '$' . number_format($totalSales, 2)),
            Stat::make("Today's Sales", '$' . number_format($todaySales, 2))
                ->description('Sales made today')
                ->color('success'),
            Stat::make('This Month', '$' . number_format($monthlySales, 2))
                ->description('Sales this month')
                ->color('primary'),
        ];
    }
}
