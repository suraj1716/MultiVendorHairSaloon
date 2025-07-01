<?php

namespace App\Filament\Resources;

use App\Enums\ProductHighlightEnum;
use App\Enums\ProductStatusEnum;
use App\Enums\RolesEnum;
use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\Pages\EditProduct;
use App\Filament\Resources\ProductResource\Pages\ProductImages;
use App\Filament\Resources\ProductResource\Pages\ProductVariations;
use App\Filament\Resources\ProductResource\Pages\ProductVariationTypes;
use App\Models\Product;
use Filament\Actions\Action;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Filament\Pages\SubNavigationPosition;
use Filament\Resources\Resource;
use Filament\Tables;

use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Support\Collection;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-s-queue-list';

    protected static ?string $navigationGroup = 'Catalog';
    protected static ?bool $navigationGroupCollapsible = true;

    protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::Top;





 public static function getEloquentQuery(): Builder
{
    $query = parent::getEloquentQuery();

    $user = Filament::auth()->user();
    logger('Logged in user ID:', ['id' => $user->id ?? null]);

    if ($user?->hasAnyRole([
    \App\Enums\RolesEnum::Admin->value,

])) {
    return $query->withoutGlobalScopes();
}

if ($user?->hasRole(\App\Enums\RolesEnum::Vendor->value)) {
    return $query->where('created_by', $user->id);
}

    // Default fallback (optional)
    return $query->whereNull('id'); // Return empty if no valid role
}



    public static function form(Form $form): Form
    {
        return $form->schema([
            Radio::make('require_additional_file')
                ->label('Require Additional File')
                ->options([
                    true => 'Yes',
                    false => 'No',
                ])
                ->inline()
                ->default(false),

            Select::make('highlight')
                ->label('Highlight')
                ->options(ProductHighlightEnum::labels())
                ->nullable()
                ->searchable()
                ->preload(),

            Forms\Components\Grid::make()->schema([
                TextInput::make('title')
                    ->live(onBlur: true)
                    ->required()
                    ->afterStateUpdated(function (string $operation, $state, callable $set) {
                        $set('slug', Str::slug($state));
                    }),

                TextInput::make('slug')->required(),

                Select::make('department_id')
                    ->relationship('department', 'name')
                    ->label(__('Department'))
                    ->preload()
                    ->searchable()
                    ->required()
                    ->reactive()
                    ->afterStateUpdated(function (string $operation, $state, callable $set) {
                        $set('category_id', null);
                    }),

                Select::make('category_id')
                    ->relationship(
                        name: 'category',
                        titleAttribute: 'name',
                        modifyQueryUsing: function (Builder $query, callable $get) {
                            $departmentId = $get('department_id');
                            if ($departmentId) {
                                $query->where('department_id', $departmentId);
                            }
                        }
                    )
                    ->label(__('Category'))
                    ->preload()
                    ->searchable()
                    ->required(),

                Forms\Components\RichEditor::make('description')
                    ->required()
                    ->toolbarButtons([
                        'blockquote',
                        'bold',
                        'italic',
                        'link',
                        'bulletList',
                        'orderedList',
                        'undo',
                        'redo',
                        'h2',
                        'h3',
                        'strike',
                        'table',
                        'underline'
                    ])
                    ->columnSpan(2),

                TextInput::make('price')
                    ->required()
                    ->numeric(),

                TextInput::make('quantity')
                    ->required()
                    ->integer()
                    ->numeric(),

                Select::make('status')
                    ->options(ProductStatusEnum::labels())
                    ->default(ProductStatusEnum::Draft->value)
                    ->required()

            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                  IconColumn::make('status')
    ->label('Status')
    ->icons([
        'heroicon-o-check-circle' => 'published',
        'heroicon-o-x-circle' => 'draft',
    ])
    ->color(fn($state) => $state === 'published' ? 'success' : 'danger')
    ->sortable()
    ->searchable(),

                SpatieMediaLibraryImageColumn::make('images')
                    ->collection('images')
                    ->limit(1)
                    ->conversion('thumb')
                    ->label('Image'),
                Tables\Columns\TextColumn::make('title')
                    ->sortable()
                    ->searchable()
                    ->words(10),




                Tables\Columns\TextColumn::make('highlight')
                    ->badge()
                    ->colors(ProductHighlightEnum::colors())
                    ->label('Highlight'),





                Tables\Columns\TextColumn::make('department.name'),
                Tables\Columns\TextColumn::make('category.name'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime(),

            ])
            ->filters([
                SelectFilter::make('status')
                    ->options(ProductStatusEnum::labels()),
                SelectFilter::make('department_id')
                    ->relationship('department', 'name'),

                SelectFilter::make('highlight')
                    ->label('Highlight')
                    ->options(ProductHighlightEnum::labels()),


            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),

                    // Duplicate Bulk Action
                    BulkAction::make('duplicate')
                        ->label('Duplicate Selected')
                        ->action(function (Collection $records) {
                            foreach ($records as $record) {
                                $newProduct = $record->replicate();
                                $newProduct->title = $record->title . ' (Copy)';
                                $newProduct->slug = \Illuminate\Support\Str::slug($newProduct->title) . '-' . uniqid();
                                $newProduct->save();

                                // Clone variation types & options
                                $record->variationTypes->each(function ($variationType) use ($newProduct) {
                                    $newVariationType = $variationType->replicate();
                                    $newVariationType->product_id = $newProduct->id;
                                    $newVariationType->save();

                                    $variationType->options->each(function ($option) use ($newVariationType) {
                                        $newOption = $option->replicate();
                                        $newOption->variation_type_id = $newVariationType->id;
                                        $newOption->save();
                                    });
                                });

                                // Clone media
                                foreach ($record->getMedia('images') as $media) {
                                    $media->copy($newProduct, 'images');
                                }
                            }
                        })
                        ->requiresConfirmation()
                        ->color('secondary'),

                    // Mark as Published
                    BulkAction::make('mark_as_published')
                        ->label('Mark as Published')
                        ->action(fn(Collection $records) => $records->each->update(['status' => 'published']))
                        ->requiresConfirmation()
                        ->color('success'),

                    // Mark as Draft
                    BulkAction::make('mark_as_draft')
                        ->label('Mark as Draft')
                        ->action(fn(Collection $records) => $records->each->update(['status' => 'draft']))
                        ->requiresConfirmation()
                        ->color('gray'),
                ]),
            ]);
    }





    public static function getActions(): array
    {
        return [
            Action::make('duplicate')
                ->label('Duplicate')
                ->icon('heroicon-o-duplicate')
                ->action(function (Model $record, $livewire) {
                    $newProduct = $record->replicate(); // clone the main product data
                    $newProduct->name = $record->name . ' (Copy)'; // optional rename
                    $newProduct->save();

                    // If you want to clone relations like variationTypes, images, etc:
                    $record->variationTypes->each(function ($variationType) use ($newProduct) {
                        $newVariationType = $variationType->replicate();
                        $newVariationType->product_id = $newProduct->id;
                        $newVariationType->save();

                        // Also clone options if you have them
                        $variationType->options->each(function ($option) use ($newVariationType) {
                            $newOption = $option->replicate();
                            $newOption->variation_type_id = $newVariationType->id;
                            $newOption->save();
                        });
                    });

                    // Clone media/images if using spatie media library
                    foreach ($record->getMedia('images') as $media) {
                        $media->copy($newProduct, 'images');
                    }

                    $livewire->notify('success', 'Product duplicated successfully!');
                    $livewire->redirect(route('filament.resources.products.edit', $newProduct));
                })
                ->requiresConfirmation()
                ->color('secondary'),
        ];
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
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
            'images' => Pages\ProductImages::route('/{record}/images'),
            'variation_types' => Pages\ProductVariationTypes::route('/{record}/variation-types'),
            'variations' => Pages\ProductVariations::route('/{record}/variations'),



        ];
    }

    public static function getRecordSubNavigation(Page $page): array
    {
        return
            $page->generateNavigationItems([
                EditProduct::class,
                ProductImages::class,
                ProductVariationTypes::class,
                ProductVariations::class,
            ]);
    }
    //Vendor can Handle Products, Admin can't


}
