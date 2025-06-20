<?php

namespace App\Filament\Resources;

use App\Models\User;
use Filament\Forms;

use Illuminate\Support\Facades\Hash;
use App\Enums\VendorType;
use App\Filament\Resources\UserResource\Pages;
use App\Models\Vendor;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TimePicker;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\SelectColumn;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
  protected static ?string $navigationIcon = 'heroicon-o-user';
    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('email')
                ->label('Email')
                ->email()
                ->required()
                ->unique(ignoreRecord: true),

            Forms\Components\TextInput::make('password')
                ->label('Password')
                ->password()
                ->required(fn ($livewire) => $livewire instanceof Pages\CreateUser)
                ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                ->dehydrated(fn ($state) => filled($state)),
        ]);
    }

  public static function table(Tables\Table $table): Tables\Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
            Tables\Columns\TextColumn::make('email')->searchable()->sortable(),
            // other columns...
        ])
       ->actions([
    Tables\Actions\Action::make('becomeVendor')
        ->label('Become Vendor')
        ->visible(fn ($record) => !$record->vendor) // 👈 Only show if user has no vendor
        ->action(function ($record, $livewire) {
            $record->vendor()->create([
                'business_start_time' => '09:00:00',
                'business_end_time' => '17:00:00',
                'slot_interval_minutes' => 30,
                'recurring_closed_days' => json_encode([]),
                'closed_dates' => json_encode([]),
                'store_name' => $record->email . "'s Store",
                'status' => 'active',
            ]);

            // $livewire->notify('success', 'Vendor created successfully.');
        }),
    ]);

}

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
