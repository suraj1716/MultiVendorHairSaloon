<?php

namespace App\Filament\Resources;

use App\Enums\OrderStatusEnum;
use App\Enums\VendorType;
use App\Models\Order;
use App\Models\VariationTypeOption;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\SelectColumn;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

// Add this:
use App\Filament\Resources\BookingResource\Pages;
use Illuminate\Support\Facades\Log;

class BookingResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar';
    protected static ?string $title = 'Bookings';
    protected static ?string $navigationLabel = 'Bookings';
    protected static ?int $navigationSort = 2;

    public static function table(Tables\Table $table): Tables\Table
    {



        return $table
            ->columns([

                Tables\Columns\TextColumn::make('is_read')
                    ->label('Read Status')
                    ->badge()
                    ->color(fn($state) => $state ? 'success' : 'danger')
                    ->icon(fn($state) => $state ? 'heroicon-m-check' : 'heroicon-m-x-mark')
                    ->label('Read Status')
                    ->formatStateUsing(fn($state) => $state ? 'Read' : 'Unread'),

                TextColumn::make('id')
                    ->sortable()
                    ->searchable()
                    ->label('Order ID'),
TextColumn::make('designer')
    ->label('Designer')
    ->getStateUsing(fn(Order $record) => optional($record->orderItems()->first())->designer ? 'Yes' : 'No')
    ->badge()
    ->color(fn($state) => $state === 'Yes' ? 'success' : 'gray'),

                TextColumn::make('vendorUser.vendor.user_id')
                    ->label('Vendor Id'),

                TextColumn::make('vendorUser.vendor.store_name')
                    ->label('Vendor Store'),
                TextColumn::make('vendorUser.vendor.vendor_type')
                    ->label('Vendor Type'),
                TextColumn::make('total_price')
                    ->money('AUD')
                    ->label('Total'),

                TextColumn::make('payment_status')
                    ->label('Payment Status')
                    ->getStateUsing(fn($record) => $record->vendor_subtotal ? 'paid' : 'draft')
                    ->sortable()
                    ->searchable(),



                TextColumn::make('booking.booking_date')
                    ->label('Booking Date')
                    ->date(),

                TextColumn::make('booking.time_slot')
                    ->label('Time Slot'),

                // TextColumn::make('attachment_path')
                //     ->label('Attachment')
                //     ->getStateUsing(fn(Order $record) => optional($record->orderItems()->first())->attachment_path ?? 'No attachment')
                //     ->url(fn(Order $record) => optional($record->orderItems()->first())->attachment_path ? asset('storage/' . $record->orderItems()->first()->attachment_path) : null)
                //     ->openUrlInNewTab()
                //     ->extraAttributes(['style' => 'max-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;']),

                Tables\Columns\TextColumn::make('variation_images')
                    ->label('Variation Images')
                    ->getStateUsing(function (Order $record) {
                        $allVariations = [];

                        foreach ($record->orderItems as $item) {
                            $variationStrings = [];
                            $variationIds = $item->variation_type_option_ids;

                            if (is_array($variationIds) && count($variationIds)) {
                                foreach ($variationIds as $optionId) {
                                    $option = VariationTypeOption::with('variationType', 'media')->find($optionId);
                                    if ($option) {
                                        $image = $option->getMedia('images')->first();
                                        $imageUrl = $image ? $image->getUrl('thumb') : null;

                                        $variationName = $option->variationType->name ?? 'N/A';
                                        $optionName = $option->name ?? 'N/A';

                                        $imageTag = $imageUrl
                                            ? "<img src='{$imageUrl}' alt='{$optionName}' style='width:30px; height:30px; object-fit:contain; margin-right:8px; border:1px solid #ccc; border-radius:4px;' />"
                                            : '';

                                        $variationStrings[] = "<div style='display:flex; align-items:center; margin-bottom:4px;'>{$imageTag}<span>{$variationName}: {$optionName}</span></div>";
                                    }
                                }
                            }

                            $allVariations[] = implode('', $variationStrings);
                        }

                        return implode('<hr style="margin:8px 0;">', $allVariations);
                    })
                    ->html()
                    ->extraAttributes([
                        'style' => 'max-height:150px; overflow-y:auto; white-space:normal;'
                    ]),


                SelectColumn::make('status')
                    ->label('Status')
                    ->options(
                        collect(OrderStatusEnum::cases())
                            ->filter(fn($case) => in_array($case->value, ['shipped', 'delivered', 'cancelled']))
                            ->mapWithKeys(fn($case) => [$case->value => $case->name])
                            ->toArray()
                    )
                    ->rules(['required'])
                    ->searchable()
                    ->afterStateUpdated(function ($record, $state) {
                        $record->status = $state;
                        $record->save();
                    }),

                TextColumn::make('created_at')
                    ->dateTime('Y-m-d H:i')
                    ->label('Date'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBookings::route('/'),
            'view' => Pages\ViewBooking::route('/{record}'),
        ];
    }




    public static function getNavigationBadge(): ?string
    {
        $user = Auth::user();

        $query = static::getModel()::where('is_read', false)
            ->whereHas('booking', fn($q) => $q->whereNotNull('booking_date'))
            ->whereHas('vendorUser.vendor', function ($q) {
                $q->where('vendor_type', VendorType::APPOINTMENT->value);
            });

        if ($user->hasRole(\App\Enums\RolesEnum::Admin->value)) {
            // Admin sees all booking orders matching criteria
        } elseif ($user->hasRole(\App\Enums\RolesEnum::Vendor->value)) {
            // Vendor sees only their own booking orders
            $query->where('vendor_user_id', $user->id);
        } else {
            // Other roles see nothing
            $query->whereRaw('1 = 0');
        }

        return (string) $query->count();
    }

    public static function getNavigationBadgeColor(): string
    {
        return 'danger';
    }
}
