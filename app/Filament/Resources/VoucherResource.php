<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VoucherResource\Pages;
use App\Filament\Resources\VoucherResource\RelationManagers;
use App\Models\Voucher;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class VoucherResource extends Resource
{
    protected static ?string $model = Voucher::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';
    protected static ?string $navigationGroup = 'Marketing';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('code')
                ->required()
                ->maxLength(20),
            Forms\Components\Select::make('type')
                ->options([
                    'gift' => 'Gift Card',
                    'promo' => 'Promo Code',
                ])
                ->required()
                ->reactive(),
            Forms\Components\TextInput::make('amount')
                ->numeric()
                ->required(),
            Forms\Components\Select::make('discount_type')
                ->options([
                    'fixed' => 'Fixed',
                    'percent' => 'Percentage',
                ])
                ->visible(fn ($get) => $get('type') === 'promo'),
            Forms\Components\TextInput::make('remaining_amount')
                ->numeric()
                ->visible(fn ($get) => $get('type') === 'gift'),
            Forms\Components\TextInput::make('max_uses')
                ->numeric()
                ->visible(fn ($get) => $get('type') === 'promo'),
            Forms\Components\DatePicker::make('expires_at')
                ->required(),
            Forms\Components\Toggle::make('active')
                ->default(true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('type')->sortable(),
                Tables\Columns\TextColumn::make('amount')->sortable(),
                Tables\Columns\TextColumn::make('remaining_amount')->sortable(),
                Tables\Columns\TextColumn::make('used_count')->sortable(),
                Tables\Columns\TextColumn::make('expires_at')->date()->sortable(),
                Tables\Columns\IconColumn::make('active')->boolean()->sortable(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVouchers::route('/'),
            'create' => Pages\CreateVoucher::route('/create'),
            'edit' => Pages\EditVoucher::route('/{record}/edit'),
        ];
    }
}
