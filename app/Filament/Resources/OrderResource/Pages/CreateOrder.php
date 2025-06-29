<?php

namespace App\Filament\Resources\OrderResource\Pages;
use Filament\Resources\Pages\CreateRecord;
use App\Filament\Resources\OrderResource;
use Filament\Actions;
use Filament\Resources\Pages\resource;

class CreateOrder extends CreateRecord
{
    protected static string $resource = OrderResource::class;
}
