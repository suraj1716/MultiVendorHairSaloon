<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductGroupResource\Pages;
use App\Filament\Resources\ProductGroupResource\RelationManagers;
use App\Models\ProductGroup;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TagsColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class ProductGroupResource extends Resource
{
    protected static ?string $model = ProductGroup::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Catalog';
    protected static ?bool $navigationGroupCollapsible = true;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn($state, callable $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')->required(),
                FileUpload::make('image')
                    ->image()
                    ->directory('product-groups'),
                Select::make('products')
                    ->multiple()
                    ->relationship('groupedProducts', 'title')
                    ->preload()
                    ->searchable(),
            ]);
    }

  public static function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('name')
                ->sortable()
                ->searchable()
                ->label('Group Name'),

            TextColumn::make('slug')
                ->sortable()
                ->searchable(),

        ImageColumn::make('image_url')  // <-- Use accessor here
            ->label('Image')
            ->square()
            ->rounded(),

            // For many-to-many relationship display - show related product titles as tags or badges
            TextColumn::make('groupedProducts')
                ->label('Products')
                ->formatStateUsing(fn ($state, $record) =>
                    $record->groupedProducts->pluck('title')->implode(', ')
                )
                ->searchable(),
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
            'index' => Pages\ListProductGroups::route('/'),
            'create' => Pages\CreateProductGroup::route('/create'),
            'edit' => Pages\EditProductGroup::route('/{record}/edit'),
        ];
    }
}
