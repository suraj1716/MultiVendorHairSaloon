<?php

namespace App\Filament\Resources\DepartmentResource\RelationManagers;

use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
   use Filament\Tables\Actions\BulkAction;
use Illuminate\Support\Collection;

class CategoriesRelationManager extends RelationManager
{
    protected static string $relationship = 'categories';

    public function form(Form $form): Form
    {
        $department = $this->getOwnerRecord();

        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),

                Forms\Components\Select::make('parent_id')
                    ->options(function () use ($department) {
                        return Category::query()
                            ->where('department_id', $department->id)
                            ->pluck('name', 'id')
                            ->toArray();
                    })
                    ->label('Parent Category')
                    ->preload()
                    ->searchable(),

                Forms\Components\FileUpload::make('image')
                    ->label('Category Image')
                    ->image()
                    ->directory('category-images') // stored in `storage/app/public/category-images`
                    ->visibility('public') // make accessible via public disk
                    ->imagePreviewHeight('100')
                    ->downloadable()
                    ->openable(),


                Checkbox::make('active')
            ]);
    }



public function table(Table $table): Table
{
    return $table
        ->recordTitleAttribute('name')
        ->columns([
             Tables\Columns\ImageColumn::make('image')
                ->label('Image')
                ->disk('public')
                ->height(60)
                ->width(60),
            Tables\Columns\TextColumn::make('name')
                ->sortable()
                ->searchable(),
            Tables\Columns\TextColumn::make('parent.name')
                ->sortable()
                ->searchable(),
            IconColumn::make('active')
                ->boolean()
                ->label('Active'),

        ])
        ->filters([
            //
        ])
        ->headerActions([
            Tables\Actions\CreateAction::make(),
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\DeleteBulkAction::make(),

                // Custom Bulk Action to toggle "active" status
                BulkAction::make('toggleActive')
                    ->label('Toggle Active Status')
                    ->action(function (Collection $records) {
                        foreach ($records as $record) {
                            $record->active = !$record->active;
                            $record->save();
                        }
                    })
                    ->deselectRecordsAfterCompletion()
                    ->requiresConfirmation(),
            ]),
        ]);
}

}
