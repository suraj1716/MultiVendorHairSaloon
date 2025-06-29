<?php

namespace App\Filament\Resources;

use App\Enums\OrderStatusEnum;
use App\Filament\Resources\OrderResource\Pages;
use App\Http\Controllers\BookingController;
use App\Models\Order;
use App\Models\Product;
use App\Models\ShippingAddress;
use App\Models\VariationTypeOption;
use Filament\Forms;
use Filament\Forms\Components\Card;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form as FormsForm;

use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables\Columns\SelectColumn;

use Filament\Tables;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document';



    public static function form(Form $form): Form
    {
        $products = Product::with('variationTypes.options')->get();
        $productOptions = $products->pluck('title', 'id')->toArray();

        return $form->schema([


            Select::make('vendor_user_id')
                ->label('Vendor')
                ->relationship('vendorUser', 'name')
                ->required(),

            TextInput::make('shipping.full_name')
                ->label('Shipping Full Name')
                ->required(),

            TextInput::make('shipping.phone')
                ->label('Shipping Phone')
                ->required(),

            TextInput::make('shipping.address_line1')
                ->label('Address Line 1')
                ->required(),

            TextInput::make('shipping.address_line2')
                ->label('Address Line 2')
                ->nullable(),

            TextInput::make('shipping.city')
                ->label('City')
                ->required(),

            TextInput::make('shipping.state')
                ->label('State')
                ->required(),

            TextInput::make('shipping.postal_code')
                ->label('Postal Code')
                ->required(),

            TextInput::make('shipping.country')
                ->label('Country')
                ->required(),

            Section::make('Order Items')->schema([
                Repeater::make('orderItems')
                    ->relationship()
                    ->schema([
                        Select::make('product_id')
                            ->label('Product')
                            ->options($productOptions)
                            ->reactive()
                            ->required(),

                        Select::make('variation_option_ids.paper_weight')
                            ->label('Paper Weight')
                            ->options(function ($get) use ($products) {
                                $productId = $get('product_id');
                                if (!$productId) return [];
                                $product = $products->firstWhere('id', $productId);
                                $variation = $product?->variationTypes->firstWhere('name', 'Paper Weight');
                                if (!$variation) return [];
                                return $variation->options->pluck('name', 'id')->toArray();
                            })
                            ->visible(fn($get) => $get('product_id') && count(
                                optional($products->firstWhere('id', $get('product_id')))
                                    ->variationTypes
                                    ->where('name', 'Paper Weight')
                            ) > 0)
                            ->required(),

                        Select::make('variation_option_ids.size')
                            ->label('Size')
                            ->options(function ($get) use ($products) {
                                $productId = $get('product_id');
                                if (!$productId) return [];
                                $product = $products->firstWhere('id', $productId);
                                $variation = $product?->variationTypes->firstWhere('name', 'Size');
                                if (!$variation) return [];
                                return $variation->options->pluck('name', 'id')->toArray();
                            })
                            ->visible(fn($get) => $get('product_id') && count(
                                optional($products->firstWhere('id', $get('product_id')))
                                    ->variationTypes
                                    ->where('name', 'Size')
                            ) > 0)
                            ->required(),

                        TextInput::make('quantity')
                            ->label('Quantity')
                            ->numeric()
                            ->minValue(1)
                            ->required()
                            ->reactive(),

                        TextInput::make('price')
                            ->label('Price')
                            ->numeric()
                            ->required()
                            ->reactive(),

                        TextInput::make('designer')
                            ->label('Designer')
                            ->type('checkbox'),

                        FileUpload::make('attachment_path')
                            ->label('Attachment')
                            ->directory('order-attachments')
                            ->nullable(),
                    ])
                    ->minItems(1)
                    ->required()
                    ->reactive()
                    ->afterStateUpdated(function ($state, callable $set) {
                        $total = 0;
                        foreach ($state as $item) {
                            $qty = $item['quantity'] ?? 0;
                            $price = $item['price'] ?? 0;
                            $total += ($qty * $price);
                        }
                        $set('total_price', $total);
                    }),
            ]),

            TextInput::make('total_price')
                ->label('Total Price')
                ->numeric()
                ->required(),

            Select::make('status')
                ->label('Status')
                ->options([
                    'draft' => 'Draft',
                    'shipped' => 'Shipped',
                    'delivered' => 'Delivered',
                    'cancelled' => 'Cancelled',
                ])
                ->default('draft')
                ->required(),
        ]);
    }







    public static function mutateFormDataBeforeCreate(array $data): array
    {
        // Save shipping address manually
        $shipping = $data['shipping'];

        $shippingAddress = \App\Models\ShippingAddress::create([
            'user_id' => \App\Models\User::max('id') + 1,

            'full_name' => $shipping['full_name'],
            'phone' => $shipping['phone'],
            'address_line1' => $shipping['address_line1'],
            'address_line2' => $shipping['address_line2'] ?? null,
            'city' => $shipping['city'],
            'state' => $shipping['state'],
            'postal_code' => $shipping['postal_code'],
            'country' => $shipping['country'],
            'is_default' => false,
        ]);

        // Assign the new ID to the order's shipping_address_id
        $data['shipping_address_id'] = $shippingAddress->id;

        // Remove the nested "shipping" form key (optional cleanup)
        unset($data['shipping']);

        return $data;
    }



    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                IconColumn::make('is_read')
                    ->label('Read')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-s-exclamation-circle')
                    ->color(fn(bool $state): string => $state ? 'gray' : 'danger')
                    ->sortable(),

                TextColumn::make('id')
                    ->sortable()
                    ->searchable()
                    ->label('Order ID'),

                TextColumn::make('designer')
                    ->label('Designer')
                    ->getStateUsing(fn(Order $record) => optional($record->orderItems()->first())->designer == 1 ? 'Yes' : 'No')
                    ->badge()
                    ->color(fn($state) => $state === 'Yes' ? 'success' : 'gray'),

                TextColumn::make('vendorUser.vendor.user_id')
                    ->label('Vendor Id'),

                TextColumn::make('vendorUser.vendor.store_name')
                    ->label('Vendor Store'),

                TextColumn::make('vendorUser.vendor.vendor_type')
                    ->label('Vendor type'),

                TextColumn::make('total_price')
                    ->money('AUD')
                    ->label('Total'),

                TextColumn::make('payment_status')
                    ->label('Payment Status')
                    ->getStateUsing(fn($record) => $record->vendor_subtotal ? 'paid' : 'draft')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('attachment_path')
                    ->label('Attachment')
                    ->getStateUsing(fn(Order $record) => optional($record->orderItems()->first())->attachment_path ?? 'No attachment')
                    ->url(fn(Order $record) => optional($record->orderItems()->first())->attachment_path ? asset('storage/' . $record->orderItems()->first()->attachment_path) : null)
                    ->openUrlInNewTab()
                    ->extraAttributes(['style' => 'max-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;']),

                TextColumn::make('variation_images')
                    ->label('Variation Images')
                    ->getStateUsing(function (Order $record) {
                        $allVariations = [];

                        foreach ($record->orderItems as $item) {
                            $variationStrings = [];
                            $variationIds = $item->variation_type_option_ids;

                            if (is_array($variationIds) && count($variationIds)) {
                                foreach ($variationIds as $optionId) {
                                    $option = VariationTypeOption::with('variationType', 'media')->find($optionId);
                                    if ($option) {
                                        $image = $option->getMedia('images')->first();
                                        $imageUrl = $image ? $image->getUrl('thumb') : null;

                                        $variationName = $option->variationType->name ?? 'N/A';
                                        $optionName = $option->name ?? 'N/A';

                                        $imageTag = $imageUrl
                                            ? "<img src='{$imageUrl}' alt='{$optionName}' style='width:30px; height:30px; object-fit:contain; margin-right:8px; border:1px solid #ccc; border-radius:4px;' />"
                                            : '';

                                        $variationStrings[] = "<div style='display:flex; align-items:center; margin-bottom:4px;'>{$imageTag}<span>{$variationName}: {$optionName}</span></div>";
                                    }
                                }
                            }

                            $allVariations[] = implode('', $variationStrings);
                        }

                        return implode('<hr style="margin:8px 0;">', $allVariations);
                    })
                    ->html()
                    ->wrap()
                    ->toggleable(),

                Tables\Columns\SelectColumn::make('status')
                    ->label('Status')
                    ->options(
                        collect(OrderStatusEnum::cases())
                            ->filter(fn($case) => in_array($case->value, ['shipped', 'delivered', 'cancelled']))
                            ->mapWithKeys(fn($case) => [$case->value => $case->name])
                            ->toArray()
                    )
                    ->rules(['required'])
                    ->searchable()
                    ->afterStateUpdated(function ($record, $state) {
                        $record->status = $state;
                        $record->save();
                    }),

                TextColumn::make('created_at')
                    ->dateTime('Y-m-d H:i')
                    ->label('Date'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),

                Tables\Actions\Action::make('refund')
                    ->label('Refund')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->action(function (Order $record) {
                        $refundService = app(\App\Services\RefundService::class);

                        if (!$record->payment_intent) {
                            Notification::make()
                                ->title('No payment intent found')
                                ->danger()
                                ->send();
                            return;
                        }

                        if ($record->refunded_at) {
                            Notification::make()
                                ->title('Order already refunded')
                                ->danger()
                                ->send();
                            return;
                        }

                        try {
                            if ($record->booking) {
                                // Refund booking fee + order total
                                $refundedAmount = $refundService->refundBookingAndOrder($record);
                            } else {
                                // Refund order only
                                $refundedAmount = $refundService->refundOrder($record);
                            }

                            if ($refundedAmount <= 0) {
                                Notification::make()
                                    ->title('No refundable amount left or refund failed')
                                    ->warning()
                                    ->send();
                                return;
                            }

                            Notification::make()
                                ->title("Successfully refunded \${$refundedAmount}")
                                ->success()
                                ->send();
                        } catch (\Exception $e) {
                            Log::error('Refund failed: ' . $e->getMessage());
                            Notification::make()
                                ->title('Refund failed')
                                ->danger()
                                ->send();
                        }
                    })
                    ->visible(fn(Order $record) => $record->payment_intent && !$record->refunded_at)
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
            'view' => Pages\ViewOrder::route('/{record}'),
        ];
    }


    public static function getNavigationBadge(): ?string
    {
        $user = Auth::user();

        $query = static::getModel()::where('is_read', false)
            ->where(function ($q) {
                $q->whereDoesntHave('booking') // No booking = order
                    ->orWhereHas('booking', fn($q) => $q->whereNull('booking_date')); // booking with null date = order
            })
            // ->whereHas('vendorUser.vendor', fn($q) => $q->where('vendor_type', 'ecommerce'))
        ;

        if ($user->hasRole(\App\Enums\RolesEnum::Admin->value)) {
            // Admin: no extra restriction
            // show all orders matching the criteria
        } elseif ($user->hasRole(\App\Enums\RolesEnum::Vendor->value)) {
            // Vendor: only orders belonging to this vendor user
            $query->where('vendor_user_id', $user->id);
        } else {
            // Other roles: no orders
            $query->whereRaw('1 = 0');
        }

        return (string) $query->count();
    }



    public static function getNavigationBadgeColor(): string
    {
        return 'danger';
    }

    public static function getTableQuery(): Builder
    {
        $query = parent::getTableQuery()
            ->with(['vendorUser.vendor']) // ensure nested eager loading
            // ->orwhereHas('vendorUser.vendor', function ($query) {
            //     $query->where('vendor_type', 'ecommerce');
            // })
            ->WhereHas('booking', fn($q) => $q->whereNull('booking_date'));

        dd($query->first()->vendorUser->vendor ?? 'null');

        return $query;
    }
}
