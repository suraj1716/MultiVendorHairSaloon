<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Enums\ProductVariationTypeEnum;
use App\Filament\Resources\ProductResource;
use Filament\Actions;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Pages\EditRecord;

class ProductVariationTypes extends EditRecord
{
    protected static string $resource = ProductResource::class;
    protected static ?string $title = ' Variation Types';
    protected static ?string $navigationIcon = 'heroicon-m-numbered-list';


   public function form(Form $form): Form
{
    $types = $this->record->variationTypes;

    return $form->schema([
        Repeater::make('variationTypes')
            ->relationship('variationTypes')
            ->label('Variation Type')
            ->collapsible()
            ->orderable()
            ->defaultItems(1)
            ->addActionLabel('Add new variation type')
            ->columns(min(4, count($types) + 2))
            ->columnSpan('full')
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->columnSpan(1),

                Select::make('type')
                    ->options(ProductVariationTypeEnum::labels())
                    ->required()
                    ->columnSpan(1),

                Repeater::make('options')
                    ->relationship()
                    ->label('Options')
                    ->collapsible()
                    ->columns(3) // Adjusted to 3 columns
                    ->columnSpan('full')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->columnSpan(1),

                        TextInput::make('price_modifier')
                            ->label('Price Modifier')
                            ->numeric()
                            ->prefix('+')
                            ->default(0)
                            ->columnSpan(1),

                        SpatieMediaLibraryFileUpload::make('image')
                            ->collection('images')
                            ->openable()
                            ->panelLayout('grid')
                            ->reorderable()
                            ->image()
                            ->appendFiles()
                            ->preserveFilenames()
                            ->multiple()
                            ->columnSpan(1),
                    ]),
            ])
    ]);
}



    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
