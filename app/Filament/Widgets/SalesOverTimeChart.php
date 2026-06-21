<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\LineChartWidget;

class SalesOverTimeChart extends LineChartWidget
{
    protected static ?string $heading = 'Sales Over Last 30 Days';

    protected function getData(): array
    {
        $sales = Order::where('is_paid', 1)
            ->whereDate('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, SUM(total_price) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('total', 'date');

        return [
            'datasets' => [
                [
                    'label' => 'Sales ($)',
                    'data' => $sales->values()->toArray(),
                    'borderColor' => '#3b82f6',
                    'backgroundColor' => 'rgba(59,130,246,0.3)',
                ],
            ],
            'labels' => $sales->keys()->toArray(),
        ];
    }
}
