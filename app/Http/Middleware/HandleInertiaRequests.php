<?php

namespace App\Http\Middleware;

use App\Http\Resources\AuthUserResource;
use App\Http\Resources\DepartmentResource;
use App\Models\CategoryGroup;
use App\Models\Department;
use App\Models\ProductGroup;
use App\services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        $departments = Department::whereHas('categories', function ($query) {
            $query->where('active', true)  // Only active categories
                ->whereHas('products');  // Categories must have products
        })
            ->with(['categories' => function ($query) {
                $query->where('active', true)  // Only active categories
                    ->with('products');      // eager load products for these categories
            }])
            ->get();

        $dpts = Department::whereHas('categories.products')
            ->withCount(['products as products_count'])
            ->get(['id', 'name', 'slug']);


        $cartService = app(CartService::class);
        $totalQuantity = $cartService->getTotalQuantity();
        $totalPrice = $cartService->getTotalPrice();
        $cartItems = $cartService->getCartItems();

        return array_merge(parent::share($request), [
            'appName' => config('app.name'),
            'csrf_token' => csrf_token(),
            'auth' => [
                'user' => $request->user() ? new AuthUserResource($request->user()) : null,
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'success' => [
                'message' => session('success'),
                'time' => microtime(true),
            ],
            'totalPrice' => $totalPrice,
            'totalQuantity' => $totalQuantity,
            'miniCartItems' => $cartItems,

            'departments' => $departments->map(function ($dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'slug' => $dept->slug,
                    'categories' => $dept->categories->map(function ($cat) {
                        return [
                            'id' => $cat->id,
                            'name' => $cat->name,
                            // You can include products if needed
                            'products' => $cat->products->map(function ($prod) {
                                return [
                                    'id' => $prod->id,
                                    'name' => $prod->title,
                                    // other product fields as needed
                                ];
                            }),
                        ];
                    }),
                ];
            }),

            'categoryGroups' => CategoryGroup::all()->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'active' => $group->active,
                ];
            }),
            'productGroups' => ProductGroup::all()->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'slug' => $group->slug,
                ];
            }),

            'dpts' => $dpts->map(function ($department) {
                return [
                    'id' => $department->id,
                    'name' => $department->name,
                    'slug' => $department->slug,
                    'productsCount' => $department->products_count,
                    'image' => $department->image,
                ];
            }),
            'error' => session('error'),

        ]);
    }
}
