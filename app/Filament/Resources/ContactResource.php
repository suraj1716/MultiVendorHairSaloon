<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactResource\Pages;
use App\Filament\Resources\ContactResource\RelationManagers;
use App\Models\Contact;
use Filament\Forms;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ContactResource extends Resource
{
    protected static ?string $model = Contact::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

  public static function form(Form $form): Form
{
    return $form->schema([
        TextInput::make('name')->disabled(),
        TextInput::make('email')->disabled(),
        Textarea::make('message')->disabled(),
        DateTimePicker::make('created_at')->label('Received At')->disabled(),
    ]);
}

public static function table(Table $table): Table
{
    return $table->columns([
        IconColumn::make('is_read')
    ->label('Read')
    ->boolean()
    ->trueIcon('heroicon-o-check-circle')
    ->falseIcon('heroicon-o-envelope')
    ->color(fn (bool $state): string => $state ? 'gray' : 'danger')
    ->sortable(),
        TextColumn::make('name')->searchable(),
        TextColumn::make('email')->searchable(),
        TextColumn::make('message')->limit(50),
        TextColumn::make('created_at')->label('Received')->dateTime(),
    ])
    ->defaultSort('created_at', 'desc');
}


    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContacts::route('/'),
            'create' => Pages\CreateContact::route('/create'),
            'edit' => Pages\EditContact::route('/{record}/edit'),
        ];
    }



public static function getNavigationBadge(): ?string
{
    $unreadCount = Contact::where('is_read', false)->count();
    return $unreadCount > 0 ? (string) $unreadCount : null;
}

public static function getNavigationBadgeColor(): string | null
{
    return 'danger'; // Red badge
}


}
