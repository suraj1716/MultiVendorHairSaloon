<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Enums\RolesEnum;
use App\Filament\Resources\OrderResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Filament\Resources\Pages\ListRecords;

class ListOrders extends ListRecords
{
    protected static string $resource = OrderResource::class;

    protected function getTableQuery(): Builder
{
    $user = Auth::user();

    // Debug info — you can remove after confirming logic works
    // dd([
    //     'auth_user_id' => $user->id,
    //     'user_role' => $user->roles->pluck('name'), // or use your role method
    //     'orders_with_auth_user' => \App\Models\Order::where('vendor_user_id', $user->id)->count(),
    //     'orders_with_ecommerce_vendor' => \App\Models\Order::whereHas('vendorUser.vendor', fn($q) => $q->where('vendor_type', 'ecommerce'))->count(),
    //     'orders_with_both' => \App\Models\Order::where('vendor_user_id', $user->id)
    //         ->whereHas('vendorUser.vendor', fn($q) => $q->where('vendor_type', 'ecommerce'))
    //         ->count(),
    // ]);

    $query = $this->getResource()::getEloquentQuery()->with(['vendorUser.vendor']);

    // Filter orders only with ecommerce vendor
    $query
    // ->orwhereHas('vendorUser.vendor', fn ($q) => $q->where('vendor_type', 'ecommerce'))
    ->where(function ($q) {
                $q->whereDoesntHave('booking') // No booking = order
                    ->orWhereHas('booking', fn($q) => $q->whereNull('booking_date')); // booking with null date = order
            })
    ;

    // Admin sees all
    if ($user->hasRole(\App\Enums\RolesEnum::Admin->value)) {
        return $query;
    }

    // Vendor sees only their own orders
    if ($user->hasRole(\App\Enums\RolesEnum::Vendor->value)) {
        return $query->where('vendor_user_id', $user->id);
    }

    // Other roles see nothing (empty result)
    return $query->whereRaw('1 = 0');
}

}
