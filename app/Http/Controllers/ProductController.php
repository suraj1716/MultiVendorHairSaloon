<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepartmentResource;
use App\Http\Resources\ProductGroupResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductListResource;
use App\Models\CategoryGroup;
use App\Models\Department;
use App\Models\HeroBanner;
use App\Models\Product;
use App\Models\ProductGroup;
use App\services\ProductSearchService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{



  public function home(Request $request)
{
    $banners = HeroBanner::where('is_active', true)
        ->latest()
        ->get()
        ->map(function ($banner) {
            $banner->image_path = $banner->image_url; // full URL from accessor
            return $banner;
        });

    $keyword = $request->query('keyword');

    // Load category groups with departments
    $categoryGroups = CategoryGroup::with(['categories.department'])
        ->where('active', true)
        ->get()
        ->map(function ($group) {
            $group->image_url; // Touch accessor
            return $group;
        });

    // Load product groups with nested products and ratings - only published products
    $productGroups = ProductGroup::where('active', 1)
        ->with([
            'groupedProducts' => function ($query) {
                $query->where('status', 'published')  // <=== filter published products only
                    ->withAvg('reviews', 'rating')   // average rating per product
                    ->withCount('reviews')           // review count per product
                    ->with([
                        'user.vendor',
                        'department',
                        'variationTypes.options.media',
                        'variations',
                        'media',
                        'reviews.user'
                    ]);
            }
        ])
        ->get();

    // Convert to resources
    $productGroupsResource = ProductGroupResource::collection($productGroups);
    $productGroupsArray = $productGroupsResource->toArray($request);

    // Get departments that have published products (filterApproved presumably means status = published)
    $departments = Department::whereHas('categories.products', fn($q) => $q->filterApproved())
        ->with(['categories' => fn($q) => $q->whereHas('products', fn($q) => $q->where('status', 'published'))])
        ->get();

    // Product search - only published products
    $products = ProductSearchService::queryWithKeyword($keyword)
        ->where('status', 'published')  // <=== filter published
        ->paginate(12);

    // All published products for whatever purpose - optional
    $allProducts = Product::with(['department', 'category', 'media', 'variationTypes.options'])
        ->where('status', 'published')
        ->get();

    // Render home page
    return Inertia::render('Home', [
        'banners' => $banners,
        'products' => ProductResource::collection($products),
        'keyword' => $keyword,
        'departments' => $departments,
        'department' => null,
        'categoryGroups' => $categoryGroups,
        'productGroups' => $productGroupsArray,
        'allproducts' => ProductResource::collection($allProducts),
    ]);
}









    public function show(Product $product)
    {
        // Load relations and reviews with user info
        $product = Product::with([
            'variationTypes.options',
            'variations',
            'category',
            'user',
            'user:id,name,created_at',
            'reviews.user:id,name'  // load reviews with the user who wrote them
        ])->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->find($product->id);

        $relatedInCategoryCount = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'published')
            ->count();

        $relatedProducts = Product::with(['media', 'user', 'category'])
            ->where('id', '!=', $product->id)
            ->when(
                $relatedInCategoryCount >= 3,
                fn($query) => $query->where('category_id', $product->category_id),
                fn($query) => $query->where('department_id', $product->department_id)
            )
            ->latest()
            ->take(8)
            ->get();


        // Calculate rating breakdown
        $rawBreakdown = $product->reviews()
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating');

        // Ensure all 1-5 stars are included, defaulting to 0 if missing
        $ratingBreakdown = collect([5, 4, 3, 2, 1])->mapWithKeys(function ($star) use ($rawBreakdown) {
            return [$star => $rawBreakdown[$star] ?? 0];
        });


        // Prepare reviews for frontend
        $reviews = $product->reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'userName' => $review->user->name ?? 'Anonymous',
                'rating' => $review->rating,
                'comment' => $review->comment,
                'createdAt' => $review->created_at->toDateTimeString(),
                'userCreatedAt' => optional($review->user)->created_at?->toDateTimeString(), // 👈 Add this
            ];
        });

        return Inertia::render('Product/Show', [
            'product' => new ProductResource($product),
            'relatedProducts' => ProductResource::collection($relatedProducts),
            'variationOptions' => request('option', []),
            'reviews' => $reviews,  // send reviews explicitly
            'ratingBreakdown' => $ratingBreakdown, // pass it to the frontend
        ]);
    }




    public function byDepartment(Request $request, $slug)
    {
        $department = Department::with(['categories' => function ($query) {
            $query->whereHas('products', function ($q) {
                $q->filterApproved();
            });
        }])->where('slug', $slug)->firstOrFail();

        $categoryId = $request->integer('category_id');
        $maxPrice = $request->float('max_price');
        $keyword = $request->query('keyword');
        $sortBy = $request->query('sort_by');

        // 1. Query all products for this department with filters, ready for pagination
        $productsQuery = Product::query()
            ->whereHas('category', function ($q) use ($department) {
                $q->where('department_id', $department->id);
            })
            ->filterApproved(
                [$department->id],
                $categoryId ? [$categoryId] : null,
                $maxPrice
            )
            ->with(['category', 'department', 'user.vendor', 'variationTypes.options.media', 'variations', 'media', 'reviews.user'])
            ->when($keyword, fn($q) => $q->where('title', 'like', "%{$keyword}%"))
            ->when($sortBy, function ($q) use ($sortBy) {
                switch ($sortBy) {
                    case 'price_asc':
                        return $q->orderBy('price', 'asc');
                    case 'price_desc':
                        return $q->orderBy('price', 'desc');
                    case 'newest':
                        return $q->orderBy('created_at', 'desc');
                    default:
                        return $q->latest();
                }
            }, fn($q) => $q->latest());

        $pagedProducts = $productsQuery->paginate(12);

        // 2. Fetch active product groups with their grouped products for this department + filters
        $productGroups = ProductGroup::where('active', 1)
            ->with([
                'groupedProducts' => function ($query) use ($department, $categoryId, $maxPrice, $keyword) {
                    $query->whereHas('category', function ($q) use ($department) {
                        $q->where('department_id', $department->id);
                    })
                        ->filterApproved(
                            [$department->id],
                            $categoryId ? [$categoryId] : null,
                            $maxPrice
                        )
                        ->when($keyword, fn($q) => $q->where('title', 'like', "%{$keyword}%"))
                        ->withAvg('reviews', 'rating')
                        ->withCount('reviews')
                        ->with([
                            'user.vendor',
                            'department',
                            'variationTypes.options.media',
                            'variations',
                            'media',
                            'reviews.user'
                        ]);
                }
            ])
            ->get();

        // Convert to resource
        $productGroupsResource = ProductGroupResource::collection($productGroups)->toArray($request);

        // 3. Fetch categories & departments as you had before
        $categories = $department->categories()
            ->whereHas('products', function ($q) use ($categoryId, $maxPrice, $keyword, $department) {
                $q->filterApproved([$department->id], $categoryId ? [$categoryId] : null, $maxPrice);
                if ($keyword) {
                    $q->where('title', 'like', "%{$keyword}%");
                }
            })
            ->get();

        $departments = Department::whereHas('categories.products', function ($query) {
            $query->filterApproved();
        })
            ->withCount(['products as products_count' => function ($query) {
                $query->filterApproved();
            }])
            ->with(['categories' => function ($query) {
                $query->whereHas('products', function ($q2) {
                    $q2->filterApproved();
                });
            }])
            ->get();

        $categoryGroups = CategoryGroup::with(['categories.department'])
            ->where('active', true)
            ->get()
            ->map(function ($group) {
                $group->image_url; // Touch accessor
                return $group;
            });

        // 4. Return data to your Inertia page
        return Inertia::render('Department/Index', [
            'department' => new DepartmentResource($department),
            'products' => ProductListResource::collection($pagedProducts),  // paginated all products
            'productGroups' => $productGroupsResource,                      // grouped products
            'categoryGroups' => $categoryGroups,
            'categories' => $categories,
            'departments' => $departments,
            'filters' => [
                'category_id' => $categoryId,
                'max_price' => $maxPrice,
                'sort_by' => $sortBy,
                'keyword' => $keyword,
                'department_id' => $department->id,
            ],
            'appName' => config('app.name'),
        ]);
    }




  public function search(Request $request)
    {

        $products = Product::where('status', 'published')
            ->with(['department', 'category', 'user'])
            ->latest()
            ->get();

        $productGroups = ProductGroup::where('active', 1)
            ->with([
                'groupedProducts' => function ($query) {
                    $query->withAvg('reviews', 'rating')   // ✅ average rating per product
                        ->withCount('reviews')           // ✅ review count per product
                        ->with([
                            'user.vendor',
                            'department',
                            'variationTypes.options.media',
                            'variations',
                            'media',
                            'reviews.user'
                        ]);
                }
            ])
            ->get();

        // Convert to resources
        $productGroupsResource = ProductGroupResource::collection($productGroups);
        $productGroupsArray = $productGroupsResource->toArray($request);
        $categoryGroups = CategoryGroup::with(['categories.department'])
            ->where('active', true)
            ->get()
            ->map(function ($group) {
                $group->image_url; // Touch accessor
                return $group;
            });
        // Get departments that have categories with products (filtered by forWebsite)
        $departments = Department::whereHas('categories.products', function ($query) {
            $query->forWebsite();
        })
            ->with(['categories' => function ($query) {
                $query->whereHas('products', function ($q) {
                    $q->forWebsite();
                });
            }])
            ->get();

        $keyword = $request->query('keyword');
        $categoryId = $request->query('category_id');
        $maxPrice = $request->query('max_price');
        $sortBy = $request->query('sort_by');



        $query = Product::query()
            ->forWebsite()
            ->with(['user.vendor', 'department'])
            ->withAvg('reviews', 'rating')->withCount('reviews'); // ✅ Add this line here

        // Initialize null
        $searchedProduct = null;

        if ($keyword) {
            // Create a separate filtered query only for search
            $searchedProduct = Product::query()
                ->forWebsite()
                ->with(['user.vendor', 'department'])
                ->withAvg('reviews', 'rating')
                ->withCount('reviews')
                ->where('title', 'LIKE', "%{$keyword}%")
                ->paginate(12)
                ->withQueryString();
        }


        if ($keyword) {
            $query->where('title', 'LIKE', "%{$keyword}%");
        }
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }
        if ($maxPrice) {
            $query->where('price', '<=', $maxPrice);
        }
        if ($sortBy) {
            if ($sortBy === 'price_asc') {
                $query->orderBy('price', 'asc');
            } elseif ($sortBy === 'price_desc') {
                $query->orderBy('price', 'desc');
            } elseif ($sortBy === 'newest') {
                $query->orderBy('created_at', 'desc');
            }
        }

        $allGroupedProducts = $productGroups
            ->flatMap(fn($group) => $group->groupedProducts)
            ->unique('id')
            ->values();

        // Manual pagination for collections
        $page = request()->get('page', 1);
        $perPage = 12;
        $offset = ($page - 1) * $perPage;

        $pagedProducts = new LengthAwarePaginator(
            $allGroupedProducts->slice($offset, $perPage)->values(), // items for current page
            $allGroupedProducts->count(),                             // total items
            $perPage,
            $page,
            ['path' => request()->url(), 'query' => request()->query()] // maintain query params
        );

        return Inertia::render('Shop/ListProducts', [
            'allProducts' => ProductListResource::collection($products),
            'products' => ProductListResource::collection($pagedProducts),
            'searchedProducts' => $searchedProduct
                ? ProductListResource::collection($searchedProduct)
                : null,
            'filters' => [
                'keyword' => $keyword,
                'category_id' => $categoryId,
                'max_price' => $maxPrice,
                'sort_by' => $sortBy,
            ],
            'departments' => $departments,  // send filtered departments only
            'categoryGroups'  => $categoryGroups,
            'productGroups'   => $productGroupsArray,
        ]);
    }




 public function showProductGroup(ProductGroup $productGroup)
{
    // Eager load only published products and their relations
    $productGroup->load([
        'products' => function ($query) {
            $query->where('status', 'published');
        },
        'products.user',
        'products.department',
        'products.options',
    ]);

    // Get only published products (paginated)
    $products = $productGroup->products()
        ->where('status', 'published')
        ->latest()
        ->paginate(12);

    return Inertia::render('showProductGroup/Show', [
        'productGroup' => $productGroup,
        'products' => ProductListResource::collection($products),
    ]);
}

}
