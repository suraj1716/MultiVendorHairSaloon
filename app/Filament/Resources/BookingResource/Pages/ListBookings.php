<?php


// namespace App\Filament\Resources\BookingResource\Pages;

// use App\Filament\Resources\BookingResource;
// use Filament\Actions;
// use Filament\Resources\Pages\ListRecords;

// class ListBookings extends ListRecords
// {
//     protected static string $resource = BookingResource::class;

//     protected function getHeaderActions(): array
//     {
//         return [
//             Actions\CreateAction::make(),
//         ];
//     }
// }






namespace App\Filament\Resources\BookingResource\Pages;
use App\Enums\RolesEnum;
use App\Enums\VendorType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use App\Filament\Resources\BookingResource;
use App\Models\Order;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListBookings extends ListRecords
{
      protected static string $resource = BookingResource::class;
    protected static ?string $title = 'Bookings List';

     protected function getTableQuery(): Builder
    {
        $user = Auth::user();

    $query = Order::query()
        ->join('users', 'orders.vendor_user_id', '=', 'users.id')
        ->join('vendors', 'users.id', '=', 'vendors.user_id')
        ->where('vendors.vendor_type', VendorType::APPOINTMENT->value)
        ->whereHas('booking', fn($q) => $q->whereNotNull('booking_date'))
        ->select('orders.*', 'vendors.vendor_type', 'vendors.store_name'); // Add these

    if (!$user->hasRole(\App\Enums\RolesEnum::Admin->value)) {
        $query->where('vendor_user_id', $user->id);
    }

    return $query;
    }
}
