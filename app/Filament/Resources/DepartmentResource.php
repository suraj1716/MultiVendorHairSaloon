<?php

namespace App\Filament\Resources;

use App\Enums\RolesEnum;
use App\Filament\Resources\DepartmentResource\Pages;
use App\Filament\Resources\DepartmentResource\RelationManagers;
use App\Filament\Resources\DepartmentResource\RelationManagers\CategoriesRelationManager;
use App\Models\Department;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class DepartmentResource extends Resource
{
    protected static ?string $model = Department::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Catalog';
protected static ?bool $navigationGroupCollapsible = true;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                FileUpload::make('image')
                    ->image()
                    ->imageEditor()
                    ->directory('departments') // optional: defines the upload folder in storage
                    ->required(false),
                TextInput::make('name')
                    ->live(onBlur: true)
                    ->required()
                    ->afterStateUpdated(function (string $operation, $state, callable $set) {
                        $set('slug', Str::slug($state));
                    }),
                TextInput::make('slug')->required(),
                Checkbox::make('active')

            ]);
    }

    public static function table(Table $table): Table
{
    return $table
        ->columns([
                        IconColumn::make('active')
    ->boolean() // Automatically shows check or cross icons for boolean
    ->label('Active')
    ->sortable()
    ->searchable(),
            ImageColumn::make('image')
                ->circular()
                ->defaultImageUrl(asset('images/department-placeholder.png')),

            TextColumn::make('name')
                ->sortable()
                ->searchable(),



            // ✅ Related Categories Column correctly placed
          TextColumn::make('categories.name')
    ->label('Categories')
    ->limit(50)
    ->toggleable()
    ->wrap()
    ->formatStateUsing(function ($state, $record) {
        // Filter categories that are active
        $activeCategories = $record->categories->filter(fn($category) => $category->active);
        // Return the comma-separated names of active categories
        return $activeCategories->pluck('name')->implode(', ');
    }),

        ])
        ->defaultSort('created_at', 'desc')
        ->filters([])
        ->actions([
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\DeleteBulkAction::make(),
BulkAction::make('Activate')
            ->label('Mark as Active')
            ->action(fn ($records) => $records->each->update(['active' => true]))
            ->requiresConfirmation()
            ->color('success')
            ->icon('heroicon-o-check'),

        BulkAction::make('Deactivate')
            ->label('Mark as Inactive')
            ->action(fn ($records) => $records->each->update(['active' => false]))
            ->requiresConfirmation()
            ->color('danger')
            ->icon('heroicon-o-x-mark'),



            ]),
        ]);
}

    public static function getRelations(): array
    {
        return [
            CategoriesRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDepartments::route('/'),
            'create' => Pages\CreateDepartment::route('/create'),
            'edit' => Pages\EditDepartment::route('/{record}/edit'),
        ];
    }

    public static function canViewAny(): bool
    {
        $user = Filament::auth()->user();

        return $user && $user->hasRole(RolesEnum::Admin);
    }
}
