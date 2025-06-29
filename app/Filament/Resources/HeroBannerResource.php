<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HeroBannerResource\Pages;
use App\Filament\Resources\HeroBannerResource\RelationManagers;
use App\Models\HeroBanner;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class HeroBannerResource extends Resource
{
    protected static ?string $model = HeroBanner::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
          return $form->schema([
            Forms\Components\TextInput::make('title')->required(),
            Forms\Components\TextInput::make('subtitle'),
            Forms\Components\TextInput::make('button_text'),
            Forms\Components\TextInput::make('button_link'),
            Forms\Components\FileUpload::make('image_path')
                ->image()
                ->directory('hero-banners')
                ->required(),
            Forms\Components\Toggle::make('is_active')->label('Visible on Home'),
        ]);
    }

    public static function table(Table $table): Table
    {
         return $table->columns([
            Tables\Columns\TextColumn::make('title')->searchable(),
            Tables\Columns\BooleanColumn::make('is_active')->label('Visible'),
            Tables\Columns\ImageColumn::make('image_path')->label('Image'),
        ])->defaultSort('id', 'desc')
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
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
            'index' => Pages\ListHeroBanners::route('/'),
            'create' => Pages\CreateHeroBanner::route('/create'),
            'edit' => Pages\EditHeroBanner::route('/{record}/edit'),
        ];
    }
}
