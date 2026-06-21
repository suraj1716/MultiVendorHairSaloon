<?php

use Filament\Pages\Page;
use App\Filament\Widgets\TotalSales;

class Dashboard extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';

    protected static string $view = 'filament.admin.pages.dashboard';

    protected function getHeaderWidgets(): array
    {
        return [
            TotalSales::class,
        ];
    }
}
