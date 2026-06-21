<?php

namespace App\Http\Middleware;

use App\Http\Resources\AuthUserResource;
use App\Http\Resources\DepartmentResource;
use App\Models\CategoryGroup;
use App\Models\Department;
use App\Models\ProductGroup;
use App\services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    //     public function version(Request $request): ?string
    // {
    //     return md5_file(public_path('build/manifest.json'));
    //     Log::info('Inertia asset version: ' . $version);
    //     return $version;
    // }
    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */


    public function share(Request $request): array
    {

        $departments = Department::whereHas('categories', function ($query) {
            $query->where('active', true)
                ->whereHas('products');
        })
            ->with(['categories' => function ($query) {
                $query->where('active', true)
                    ->withCount('products')  // important: load 'products_count' here!
                    ->with('products');      // eager load products for your category too
            }])
            ->get()
            ->map(function ($dept) {
                // Sum products_count from each category, check if it exists before sum
                $dept->productsCount = $dept->categories->sum('products_count') ?? 0;
                return $dept;
            });





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
                    'image' => $dept->image,
                    'productsCount' => $dept->categories->sum('products_count'), //
                    'categories' => $dept->categories->map(function ($cat) {
                        return [
                            'id' => $cat->id,
                            'name' => $cat->name,
                            'products' => $cat->products->map(function ($prod) {
                                return [
                                    'id' => $prod->id,
                                    'name' => $prod->title,
                                ];
                            }),
                        ];
                    }),
                ];
            }),


            'categoryGroups' => CategoryGroup::with(['categories.department'])
                ->where('active', true)
                ->get()
                ->map(function ($group) {
                    $group->image_url;
                    return $group;
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
                    'active' => $department->active,
                ];
            }),


            'adminCounts' => function () {
                $counts = [
                    'contacts' => \App\Models\Contact::where('is_read', false)->count(),
                    'orders'   => \App\Models\Order::where('is_read', false)->count(),
                    'bookings' => \App\Models\Booking::where('is_read', false)->count(),
                ];
                \Illuminate\Support\Facades\Log::info('adminCounts', $counts);
                return $counts;
            },

        ]);
    }
}
