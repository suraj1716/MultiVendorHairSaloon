<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use App\Models\Product;
use Filament\Actions;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;
use Filament\Pages\Actions\Action;
use InteractsWithNotifications;
use Filament\Notifications\Notification;

class ProductVariations extends EditRecord
{
    public ?Product $product = null;

    protected static string $resource = ProductResource::class;
    protected static ?string $title = 'Variation';
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';



    public function mount($record): void
    {
        parent::mount($record);

        $this->record->loadMissing('variationTypes.options', 'variations');

        $types = $this->record->variationTypes;

        $this->form->fill([
            'variations' => $this->record->variations
                ->sortBy('sn') // Sort by SN to match expected order
                ->values() // Reset keys to 0-based
                ->map(function ($variation,  $index) use ($types) {
                    $fields = [
                        'id' => $variation->id,
                        'sn' => ($index + 1),
                        'price' => $variation->price,
                    ];

                    foreach ($types as $type) {
                        $typeOptionIds = collect($variation->variation_type_option_ids)->map(fn($id) => (int) $id);
                        $availableIds = $type->options->pluck('id')->map(fn($id) => (int) $id);

                        $matchedId = $typeOptionIds->intersect($availableIds)->first();

                        $fields['variation_type_' . $type->id] = $matchedId;
                    }

                    return $fields;
                })->toArray(),
        ]);
    }


    public function form(Form $form): Form
    {
        $types = $this->record->variationTypes;

        return $form
            ->schema([
                Section::make('Product Variations')
                    ->schema([
                        Repeater::make('variations')
                            ->label('Product Variations')
                            ->columns(min(5, count($types) + 4))
                            ->schema(function () use ($types) {
                                $fields = [];

                                // Hidden ID field for tracking variation updates
                                $fields[] = Hidden::make('id');

                                // SN field
                                $fields[] = TextInput::make('sn')
                                    ->label('SN')
                                    ->disabled()
                                    ->dehydrated(false)
                                    ->extraAttributes([
                                        'class' => 'w-16 text-center',
                                        'readonly' => true,
                                    ])
                                    ->columnSpan(1);

                                foreach ($types as $type) {
                                    $fields[] = Select::make('variation_type_' . $type->id)
                                        ->label($type->name)
                                        ->options($type->options->pluck('name', 'id'))
                                        ->required()
                                        ->preload()
                                        ->columnSpan(1);
                                }

                                $fields[] = TextInput::make('price')
                                    ->label('Price')
                                    ->step(0.01) // Allows 3 decimal places
                                    ->numeric()
                                    ->required()
                                    ->columnSpan(1);

                                return $fields;
                            })
                            ->default([]),
                    ])
                    ->columnSpanFull()
            ]);
    }




    protected function mutateFormDataBeforeFill(array $data): array
    {
        $variationTypes = $this->record->variationTypes()->with('options')->orderBy('sort')->get();

        $existingVariations = $this->record->variations()->get()->map(function ($variation) {
            return [
                'id' => $variation->id,
                'variation_type_option_ids' => is_string($variation->variation_type_option_ids)
                    ? json_decode($variation->variation_type_option_ids, true)
                    : $variation->variation_type_option_ids,
                'quantity' => $variation->quantity,
                'price' => $variation->price,
            ];
        })->toArray();

        $mergedVariations = $this->mergeCartesianWithExisting($variationTypes, $existingVariations);

        foreach ($mergedVariations as $index => &$item) {
            $item['sn'] = $index + 1;
        }
        unset($item);

        $data['variations'] = $mergedVariations;

        return $data;
    }







    // 3. Compare deleted_combinations properly in mergeCartesianWithExisting:
    private function mergeCartesianWithExisting($variationTypes, $existingData): array
    {
        $defaultQuantity = $this->record->quantity;
        $defaultPrice = $this->record->price;
        $deletedCombinationsRaw = $this->record->deleted_combinations ?? [];

        // Normalize deleted combinations for comparison
        $deletedCombinations = array_map(function ($combo) {
            $ids = (array) $combo;
            sort($ids);
            return $ids;
        }, $deletedCombinationsRaw);

        $cartesianProduct = $this->cartesianProduct($variationTypes, $defaultQuantity, $defaultPrice);
        $mergeResult = [];

        foreach ($cartesianProduct as $product) {
            $optionsIds = collect($product)
                ->filter(fn($value, $key) => str_starts_with($key, 'variation_type_'))
                ->map(fn($option) => $option['id'])
                ->values()
                ->toArray();

            sort($optionsIds);

            // Check if this combination was deleted before
            $isDeleted = false;
            foreach ($deletedCombinations as $deletedCombo) {
                if ($deletedCombo === $optionsIds) {
                    $isDeleted = true;
                    break;
                }
            }
            if ($isDeleted) {
                continue; // Skip this combo
            }

            // Matching existing variations logic stays the same...
            $match = array_filter($existingData, function ($existingOption) use ($optionsIds) {
                $existingIds = (array) $existingOption['variation_type_option_ids'];
                sort($existingIds);
                return $existingIds == $optionsIds;
            });

            if (!empty($match)) {
                $existingEntry = reset($match);
                $product['id'] = $existingEntry['id'];
                $product['quantity'] = $existingEntry['quantity'];
                $product['price'] = $existingEntry['price'];
            } else {
                $product['quantity'] = $defaultQuantity;
                $product['price'] = $defaultPrice;
            }

            $mergeResult[] = $product;
        }

        return $mergeResult;
    }



    private function cartesianProduct($variationTypes, $defaultQuantity = null, $defaultPrice = null): array
    {
        $result = [[]];

        foreach ($variationTypes as $variationType) {
            $temp = [];
            foreach ($variationType->options as $option) {
                foreach ($result as $combination) {
                    $temp[] = $combination + [
                        'variation_type_' . $variationType->id => [
                            'id' => $option->id,
                            'name' => $option->name,
                            'label' => $variationType->name,
                            'price_modifier' => $option->price_modifier ?? 0,
                        ],
                    ];
                }
            }
            $result = $temp;
        }

        foreach ($result as &$combination) {
            if (count($combination) === count($variationTypes)) {
                $modifierTotal = collect($combination)
                    ->map(fn($v) => $v['price_modifier'] ?? 0)
                    ->sum();

                $combination['quantity'] = $defaultQuantity;
                $combination['price'] = $defaultPrice + $modifierTotal;
            }
        }

        unset($combination);
        return $result;
    }



    protected function mutateFormDataBeforeSave(array $data): array
    {
        $formattedData = [];

        foreach ($data['variations'] ?? [] as $option) {
            $variationTypeOptionIds = [];
            $modifierTotal = 0;

            foreach ($this->record->variationTypes as $variationType) {
                $variationTypeKey = 'variation_type_' . $variationType->id;
                if (!empty($option[$variationTypeKey])) {
                    $optionId = (int) $option[$variationTypeKey];
                    $variationTypeOptionIds[] = $optionId;

                    $modifier = $variationType->options->firstWhere('id', $optionId)?->price_modifier ?? 0;
                    $modifierTotal += $modifier;
                }
            }

            $basePrice = $option['price'] ?? $this->record->price;
            // No addition of modifier here:
            $finalPrice = $basePrice;

            $formattedData[] = [
                'id' => $option['id'] ?? null,
                'variation_type_option_ids' => $variationTypeOptionIds,
                'quantity' => $option['quantity'] ?? $this->record->quantity,
                'price' => $finalPrice,
            ];
        }

        $data['variations'] = $formattedData;

        return $data;
    }




    // 1. Fix deleted combinations fetch before delete:
    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        $variations = $data['variations'];
        unset($data['variations']);

        $variations = collect($variations)->map(function ($variation) {
            return [
                'id' => $variation['id'] ?? null,
                'variation_type_option_ids' => json_encode($variation['variation_type_option_ids']),
                'quantity' => $variation['quantity'],
                'price' => $variation['price'],
            ];
        })->toArray();

        $existingVariationIds = $record->variations()->pluck('id')->toArray();
        $submittedVariationIds = collect($variations)->pluck('id')->filter()->toArray();
        $variationsToDelete = array_diff($existingVariationIds, $submittedVariationIds);

        // Fetch deleted combos BEFORE delete
        $deletedCombinations = $record->variations()
            ->whereIn('id', $variationsToDelete)
            ->get()
            ->pluck('variation_type_option_ids')
            ->values()
            ->toArray();


        $record->variations()->whereIn('id', $variationsToDelete)->delete();

        $record->variations()->upsert($variations, ['id'], ['variation_type_option_ids', 'quantity', 'price']);

        $existing = $record->deleted_combinations ?? [];
        $record->deleted_combinations = collect($existing)
            ->merge($deletedCombinations)
            ->unique()
            ->values()
            ->all();

        $record->save();

        return parent::handleRecordUpdate($record, $data);
    }




    public function deleteAllCombinations()
    {
        $this->product->variations()->delete();
    }


    public function getActions(): array
    {
        return [

            Action::make('generate_combinations')
                ->label('Generate All Combinations')
                ->action(function () {
                    $product = $this->record;

                    $variationTypes = $product->variationTypes()->with('options')->get();

                    $cartesian = $this->cartesianProduct($variationTypes, $product->quantity, $product->price);

                    // Map cartesian to variation data format for form
                    $variations = [];

                    foreach ($cartesian as $index => $combination) {
                        $variationTypeOptionIds = [];

                        foreach ($variationTypes as $type) {
                            $key = 'variation_type_' . $type->id;
                            $variationTypeOptionIds[] = $combination[$key]['id'];
                        }

                        $variations[] = [
                            'id' => null,
                            'sn' => $index + 1,
                            'quantity' => $product->quantity,
                            'price' => $combination['price'],  // Use the calculated price here!
                            // Add option ids keyed by variation type for form selects
                            ...array_combine(
                                array_map(fn($t) => 'variation_type_' . $t->id, $variationTypes->all()),
                                $variationTypeOptionIds
                            ),
                        ];
                    }

                    // Set the form data programmatically with these variations
                    $this->form->fill([
                        'variations' => $variations,
                    ]);
                })
                ->requiresConfirmation()
                ->button(),

            Action::make('delete_all')
                ->label('Delete All Combinations')
                ->color('danger')
                ->requiresConfirmation()
                ->action(function () {
                    \App\Models\ProductVariation::where('product_id', $this->record->id)->delete();
                    Notification::make()
                        ->title('All product variations deleted.')
                        ->success()
                        ->send();
                }),



        ];
    }
}
