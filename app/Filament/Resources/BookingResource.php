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
use App\Http\Controllers\BookingController;
use App\Services\RefundService;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\IconColumn;
use Illuminate\Support\Facades\Log;
use Filament\Tables\Filters\DateFilter;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Http;

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
                Tables\Columns\TextColumn::make('booking.id')
                    ->label('Booking ID')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('booking.order_id')
                    ->label('Order ID')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('User')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('vendorUser.vendor.store_name')
                    ->label('Vendor Store')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('booking.booking_date')
                    ->label('Booking Date')
                    ->date()
                    ->sortable(),

                Tables\Columns\TextColumn::make('booking.time_slot')
                    ->label('Time Slot'),

                Tables\Columns\TextColumn::make('status')
                    ->label('Booking Status')
                    ->badge()
                    ->color(fn(string $state) => match ($state) {
                        'active' => 'success',
                        'inactive' => 'danger',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('booking.booking_fee_refund_amount')
                    ->label('Booking Fee Refund')
                    ->money('AUD')
                    ->sortable(),

                Tables\Columns\TextColumn::make('total_price')
                    ->label('Order Total')
                    ->money('AUD')
                    ->sortable(),

                Tables\Columns\TextColumn::make('booking.order.booking_fee')
                    ->label('Booking Fee (Order)')
                    ->money('AUD'),

                Tables\Columns\TextColumn::make('booking.order.status')
                    ->label('Order Status')
                    ->badge()
                    ->color(fn(string $state) => match ($state) {
                        'pending' => 'warning',
                        'shipped' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn($state) => \App\Enums\OrderStatusEnum::tryFrom($state)?->name ?? 'Unknown'),

                Tables\Columns\TextColumn::make('booking.order.payment_intent')
                    ->label('Payment Intent')
                    ->toggleable()
                    ->limit(20)
                    ->tooltip(fn($state) => $state),

                Tables\Columns\TextColumn::make('refund_amount')
                    ->label('Refunded Amount')
                    ->money('AUD'),

                Tables\Columns\TextColumn::make('booking.order.refund_reason')
                    ->label('Refund Reason')
                    ->limit(30)
                    ->tooltip(fn($state) => $state),

                IconColumn::make('booking.order.refunded_at')
                    ->label('Refunded')
                    ->boolean()
                    ->color(fn($state) => $state ? 'success' : 'secondary')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Booking Created')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Last Updated')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),

                IconColumn::make('is_read')
                    ->label('Read Status')
                    ->boolean()
                    ->color(fn($state) => $state ? 'success' : 'danger')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('order.status')
                    ->label('Order Status')
                    ->options([
                        'draft' => 'Draft',
                        'paid' => 'Paid',
                        'cancelled' => 'Cancelled',
                        'shipped' => 'Shipped',
                        'delivered' => 'Delivered',
                    ]),

                Tables\Filters\Filter::make('booking_fee_refunded')
                    ->label('Booking Fee Refunded')
                    ->query(function ($query) {
                        $query->whereHas('booking', function ($q) {
                            $q->where('booking_fee_refunded', true);
                        });
                    }),

                Filter::make('is_read')
                    ->label('Read Status')
                    ->query(fn($query) => $query->where('is_read', true)),

                Tables\Filters\Filter::make('booking_date')
                    ->form([
                        \Filament\Forms\Components\DatePicker::make('start_date')->label('Start Date'),
                        \Filament\Forms\Components\DatePicker::make('end_date')->label('End Date'),
                    ])
                    ->query(function ($query, array $data) {
                        $query->whereHas('booking', function ($q) use ($data) {
                            if (!empty($data['start_date']) && !empty($data['end_date'])) {
                                $q->whereBetween('booking_date', [$data['start_date'], $data['end_date']]);
                            } elseif (!empty($data['start_date'])) {
                                $q->where('booking_date', '>=', $data['start_date']);
                            } elseif (!empty($data['end_date'])) {
                                $q->where('booking_date', '<=', $data['end_date']);
                            }
                        });
                    })

            ])
            ->actions([
                Tables\Actions\ViewAction::make(),

                Tables\Actions\Action::make('cancelBooking')
                    ->label('Cancel Booking')
                    ->color('warning')
                    ->icon('heroicon-o-x-circle')
                    ->requiresConfirmation()
                    ->visible(
                        fn(Order $record) =>
                        $record->booking &&
                            $record->booking->booking_date &&
                            now()->lt($record->booking->booking_date) &&
                            !$record->booking->booking_fee_refunded
                    )
                    ->action(function (Order $record) {
                        $booking = $record->booking;

                        if (!$booking || now()->gt($booking->booking_date)) {
                            Notification::make()
                                ->title('Booking already occurred or not found')
                                ->danger()
                                ->send();
                            return;
                        }

                        try {
                            // Manually inject controller and dependencies
                            $controller = App::make(BookingController::class);
                            $refundService = App::make(RefundService::class);

                            // Call the cancel method directly (as it's not a real HTTP request)
                            $controller->cancel($booking, $refundService);

                            $record->refresh(); // Refresh to get updated status

                            Notification::make()
                                ->title('Booking cancelled and refund processed if applicable')
                                ->success()
                                ->send();
                        } catch (\Exception $e) {
                            Log::error('Cancel booking error: ' . $e->getMessage());

                            Notification::make()
                                ->title('Failed to cancel booking')
                                ->danger()
                                ->send();
                        }
                    }),

                Tables\Actions\Action::make('refund')
                    ->label('Refund')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->visible(function ($record) {
                        $booking = $record->booking;
                        $order = $booking?->order;

                        return $record->payment_intent &&
                            // !$record->refunded_at &&
                            $order &&
                            $order->total_price > 0;
                    })
                    ->action(function ($record) {
                        $refundService = app(\App\Services\RefundService::class);


                        try {
                            $refundedAmount = $record->booking
                                ? $refundService->refundBookingAndOrder($record)
                                : $refundService->refundOrder($record);

                            if ($refundedAmount <= 0) {
                                Notification::make()
                                    ->title('No refundable amount left')
                                    ->warning()
                                    ->send();
                                return;
                            }

                            Notification::make()
                                ->title("Refunded \${$refundedAmount}")
                                ->success()
                                ->send();
                        } catch (\Exception $e) {
                            Log::error('Refund error: ' . $e->getMessage());

                            Notification::make()
                                ->title('Refund failed')
                                ->danger()
                                ->send();
                        }
                    }),

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
