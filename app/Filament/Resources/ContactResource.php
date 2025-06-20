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
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Support\Enums\Alignment;
use Filament\Tables\Filters\SelectFilter;

class ContactResource extends Resource
{
    protected static ?string $model = Contact::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';


public static function form(Form $form): Form
{
    return $form->schema([
        TextInput::make('name')->disabled(),
        TextInput::make('email')->disabled(),
        Select::make('reason')
            ->disabled()
            ->options([
                'getting_quote' => 'Getting a Quote',
                'general' => 'General Inquiry',
                'support' => 'Support',
                // Add your other reasons
            ]),
        Select::make('department_id')
            ->label('Department')
            ->relationship('department', 'name')
            ->disabled(),
        Select::make('category_id')
            ->label('Category')
            ->relationship('category', 'name')
            ->disabled(),
        Select::make('product_id')
            ->label('Product')
            ->relationship('product', 'title')
            ->disabled(),
        TextInput::make('quantity')->disabled(),
        Textarea::make('message')->disabled(),
        FileUpload::make('file_path')
            ->label('Uploaded File')
            ->downloadable()
            ->disabled()
            ->directory('contacts')
            ->visible(fn ($record) => $record?->file_path), // only show if uploaded
        Select::make('status')
            ->options([
                'pending' => 'Pending',
                'in_progress' => 'In Progress',
                'resolved' => 'Resolved',
            ])
            ->required()
            ->native(false),
        DateTimePicker::make('created_at')
            ->label('Received At')
            ->disabled(),
    ]);
}


public static function table(Table $table): Table
{
    return $table
        ->columns([
            IconColumn::make('is_read')
                ->label('Read')
                ->boolean()
                ->trueIcon('heroicon-o-check-circle')
                ->falseIcon('heroicon-o-envelope')
                ->color(fn (bool $state): string => $state ? 'gray' : 'danger')
                ->sortable(),

            TextColumn::make('name')->searchable(),
            TextColumn::make('email')->searchable(),
            TextColumn::make('reason')->label('Reason')->sortable(),
            TextColumn::make('department.name')->label('Department')->sortable(),
            TextColumn::make('category.name')->label('Category')->sortable(),
            TextColumn::make('product.title')->label('Product')->sortable(),
            TextColumn::make('quantity')->sortable(),
            TextColumn::make('status')
                ->badge()
                ->color(fn (string $state): string => match ($state) {
                    'pending' => 'warning',
                    'in_progress' => 'info',
                    'resolved' => 'success',
                    default => 'gray',
                }),
            TextColumn::make('created_at')->label('Received')->dateTime(),

            TextColumn::make('file_path')
                ->label('File')
                ->formatStateUsing(fn ($state) => $state ? 'Download' : '-')
                ->url(fn ($record) => $record->file_path ? asset('storage/' . $record->file_path) : null)
                ->openUrlInNewTab()
                ->toggleable(),
        ])
        ->defaultSort('created_at', 'desc')
        ->filters([
            Tables\Filters\SelectFilter::make('status')
                ->options([
                    'pending' => 'Pending',
                    'in_progress' => 'In Progress',
                    'resolved' => 'Resolved',
                ]),
            ])
             ->filters([
            SelectFilter::make('reason')
                ->label('Reason')
                ->options([
                    'getting_quote' => 'Getting Quote',
                    'support' => 'Support',
                    'other' => 'Other',
                    // add all your reason options here...
                ]),
        ]);
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
