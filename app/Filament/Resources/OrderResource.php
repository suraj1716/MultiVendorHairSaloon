<?php

namespace App\Filament\Resources;

use App\Enums\OrderStatusEnum;
use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use App\Models\VariationTypeOption;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables\Columns\SelectColumn;

use Filament\Tables;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    public static function table(Table $table): Table
    {
        return $table

            ->columns([

IconColumn::make('is_read')
    ->label('Read')
    ->boolean()
    ->trueIcon('heroicon-o-check-circle')
    ->falseIcon('heroicon-s-exclamation-circle')
    ->color(fn (bool $state): string => $state ? 'gray' : 'danger')
    ->sortable(),

                // Tables\Columns\TextColumn::make('is_read')
                //     ->label('Read Status')
                //     ->badge()
                //     ->color(fn($state) => $state ? 'success' : 'danger')
                //     ->icon(fn($state) => $state ? 'heroicon-m-check' : 'heroicon-m-x-mark')
                //     ->label('Read Status')
                //     ->formatStateUsing(fn($state) => $state ? 'Read' : 'Unread'),


                Tables\Columns\TextColumn::make('id')
                    ->sortable()->searchable()
                    ->label('Order ID'),





                Tables\Columns\TextColumn::make('vendorUser.vendor.user_id')
                    ->label('Vendor Id'),

                Tables\Columns\TextColumn::make('vendorUser.vendor.store_name')
                    ->label('Vendor Store'),
                Tables\Columns\TextColumn::make('vendorUser.vendor.vendor_type')
                    ->label('Vendor type'),
                Tables\Columns\TextColumn::make('total_price')
                    ->money('AUD')
                    ->label('Total'),

                Tables\Columns\TextColumn::make('payment_status')
                    ->label('Payment Status')
                    ->getStateUsing(function ($record) {
                        return $record->vendor_subtotal ? 'paid' : 'draft';
                    })
                    ->sortable()
                    ->searchable(),


                // {-- this table returns rows that have booking.booking_date== null, so hiding this columns--}

                // Tables\Columns\TextColumn::make('booking.booking_date')
                //     ->label('Booking Date')
                //     ->date(),

                // Tables\Columns\TextColumn::make('booking.time_slot')
                //     ->label('Time Slot'),



                Tables\Columns\TextColumn::make('attachment_path')
                    ->label('Attachment')
                    ->getStateUsing(function (Order $record) {
                        return optional($record->orderItems()->first())->attachment_path ?? 'No attachment';
                    })
                    ->url(fn(Order $record) => optional($record->orderItems()->first())->attachment_path ? asset('storage/' . $record->orderItems()->first()->attachment_path) : null)
                    ->openUrlInNewTab()
                    ->extraAttributes(['style' => 'max-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;']),


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

                                        // Wrap image and text in a flex container for side-by-side layout
                                        $variationStrings[] = "<div style='display:flex; align-items:center; margin-bottom:4px;'>{$imageTag}<span>{$variationName}: {$optionName}</span></div>";
                                    }
                                }
                            }

                            $allVariations[] = implode('', $variationStrings);
                        }

                        return implode('<hr style="margin:8px 0;">', $allVariations);
                    })
                    ->html()
                    ->wrap()
                    ->toggleable(),


                Tables\Columns\SelectColumn::make('status')
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

                Tables\Columns\TextColumn::make('created_at')
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
            'index' => Pages\ListOrders::route('/'),
            'view' => Pages\ViewOrder::route('/{record}'),
        ];
    }


   public static function getNavigationBadge(): ?string
{
    $user = Auth::user();

    $query = static::getModel()::where('is_read', false)
        ->where(function ($q) {
            $q->whereDoesntHave('booking') // No booking = order
              ->orWhereHas('booking', fn($q) => $q->whereNull('booking_date')); // booking with null date = order
        })
        ->whereHas('vendorUser.vendor', fn($q) => $q->where('vendor_type', 'ecommerce'));

    if ($user->hasRole(\App\Enums\RolesEnum::Admin->value)) {
        // Admin: no extra restriction
        // show all orders matching the criteria
    } elseif ($user->hasRole(\App\Enums\RolesEnum::Vendor->value)) {
        // Vendor: only orders belonging to this vendor user
        $query->where('vendor_user_id', $user->id);
    } else {
        // Other roles: no orders
        $query->whereRaw('1 = 0');
    }

    return (string) $query->count();
}



    public static function getNavigationBadgeColor(): string
    {
        return 'danger';
    }

    public static function getTableQuery(): Builder
    {
        $query = parent::getTableQuery()
            ->with(['vendorUser.vendor']) // ensure nested eager loading
            ->whereHas('vendorUser.vendor', function ($query) {
                $query->where('vendor_type', 'ecommerce');
            });

        dd($query->first()->vendorUser->vendor ?? 'null');

        return $query;
    }
}
