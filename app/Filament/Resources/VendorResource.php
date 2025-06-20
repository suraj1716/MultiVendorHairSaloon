<?php

namespace App\Filament\Resources;

use App\Enums\VendorStatusEnum;
use App\Enums\VendorType;
use App\Filament\Resources\VendorResource\Pages;
use App\Models\Vendor;
use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TimePicker;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\SelectColumn;
use Illuminate\Support\Facades\Hash;

class VendorResource extends Resource
{
    protected static ?string $model = Vendor::class;
     protected static ?string $navigationIcon = 'heroicon-o-building-storefront'; // for a "store" icon

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')->label('Name')->sortable()->searchable(),
                TextColumn::make('user.email')->label('Email')->sortable()->searchable(),
                TextColumn::make('store_name')->label('Store Name')->sortable()->searchable(),

                // Display vendor_type with labels
                TextColumn::make('vendor_type')
                    ->label('Vendor Type')
                    ->sortable()
                    ->searchable()
                    ->formatStateUsing(fn($state) => VendorType::labels()[$state] ?? $state),

                // Editable vendor_type dropdown in table
                SelectColumn::make('vendor_type')
                    ->label('Update Vendor Type')
                    ->options(VendorType::labels())
                    ->rules(['required'])
                    ->searchable()
                    ->sortable()
                    ->afterStateUpdated(function ($record, $state) {
                        $record->vendor_type = $state;
                        $record->save();
                    }),

                // New booking_fee column added
                TextColumn::make('booking_fee')
                    ->label('Booking Fee')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('business_start_time')->label('Start Time'),
                TextColumn::make('business_end_time')->label('End Time'),
                TextColumn::make('slot_interval_minutes')->label('Slot Interval'),

                TextColumn::make('recurring_closed_days')
                    ->label('Recurring Closed Days')
                    ->formatStateUsing(function ($state) {
                        if (is_string($state)) {
                            $state = array_map('trim', explode(',', $state));
                        }
                        if (is_array($state)) {
                            $dayMap = [
                                0 => 'Sunday',
                                1 => 'Monday',
                                2 => 'Tuesday',
                                3 => 'Wednesday',
                                4 => 'Thursday',
                                5 => 'Friday',
                                6 => 'Saturday',
                            ];
                            $days = array_map(fn($num) => $dayMap[(int)$num] ?? $num, $state);
                            return implode(', ', $days);
                        }
                        return $state;
                    }),

                TextColumn::make('closed_dates')->label('Closed Dates'),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn($state) => array_search($state, VendorStatusEnum::colors()))
                    ->formatStateUsing(fn($state) => VendorStatusEnum::labels()[$state] ?? $state)
                    ->sortable(),

                SelectColumn::make('status')
                    ->label('Update Status')
                    ->options(
                        collect(VendorStatusEnum::cases())
                            ->mapWithKeys(fn($case) => [$case->value => $case->label()])
                            ->toArray()
                    )
                    ->rules(['required'])
                    ->searchable()
                    ->sortable()
                    ->afterStateUpdated(function ($record, $state) {
                        $record->status = $state;
                        $record->save();
                    }),
            ])
            ->actions([
                Action::make('connect_to_stripe')
                    ->label('Connect to Stripe')
                    ->color('primary')
                    ->icon('heroicon-o-link')
                    ->visible(fn($record) => !$record->user->stripe_account_active)
                    ->url(fn($record) => route('stripe.connect', ['user' => $record->user->id]))
                    ->openUrlInNewTab(),

                Action::make('stripe_connected')
                    ->label('Connected to Stripe')
                    ->color('success')
                    ->icon('heroicon-o-check-circle')
                    ->disabled()
                    ->visible(fn($record) => $record->user->stripe_account_active),
            ]);
    }

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form
            ->schema([


                TimePicker::make('business_start_time')
                    ->label('Business Start Time')
                    ->required(),

                TimePicker::make('business_end_time')
                    ->label('Business End Time')
                    ->required(),

                Forms\Components\TextInput::make('slot_interval_minutes')
                    ->label('Slot Interval (minutes)')
                    ->numeric()
                    ->minValue(5)
                    ->required(),

                Select::make('recurring_closed_days')
                    ->multiple()
                    ->options([
                        0 => 'Sunday',
                        1 => 'Monday',
                        2 => 'Tuesday',
                        3 => 'Wednesday',
                        4 => 'Thursday',
                        5 => 'Friday',
                        6 => 'Saturday',
                    ])
                    ->label('Recurring Closed Days')
                    ->formatStateUsing(fn($state) => array_filter(
                        array_map(fn($item) => is_numeric($item) ? (int) $item : null, $state ?? []),
                        fn($item) => $item !== null
                    )),

                Forms\Components\Textarea::make('closed_dates')
                    ->label('Closed Dates')
                    ->helperText('Enter closed dates as comma-separated (e.g., 2025-05-30,2025-06-10)')
                    ->dehydrateStateUsing(function ($state) {
                        if (is_array($state)) {
                            return array_filter(array_map('trim', $state));
                        } elseif (is_string($state)) {
                            return array_filter(array_map('trim', explode(',', $state)));
                        }
                        return [];
                    }),

                // Added vendor_type select field
                Select::make('vendor_type')
                    ->label('Vendor Type')
                    ->options(VendorType::labels())
                    ->required(),

                // Added booking_fee text input
                Forms\Components\TextInput::make('booking_fee')
                    ->label('Booking Fee')
                    ->numeric()
                    ->required(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVendors::route('/'),
            'create' => Pages\CreateVendor::route('/create'),
            'edit' => Pages\EditVendor::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->with('user');
    }

    public static function mutateFormDataBeforeCreate(array $data): array
    {
        // Extract email and hashed password from form data
        $email = $data['email'];
        $password = $data['password']; // Already hashed by dehydrateStateUsing

        // Create User
        $user = \App\Models\User::create([
            'email' => $email,
            'password' => $password,
            // Add more fields if needed
        ]);

        // Assign new user id to vendor
        $data['user_id'] = $user->id;

        // Remove email and password from vendor data
        unset($data['email'], $data['password']);

        return $data;
    }
}
