<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepartmentResource;
use App\Http\Resources\ProductGroupResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductListResource;
use App\Models\CategoryGroup;
use App\Models\Department;
use App\Models\Product;
use App\Models\ProductGroup;
use App\services\ProductSearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{



    public function home(Request $request)
    {
        $keyword = $request->query('keyword');

        // Load category groups with departments
        $categoryGroups = CategoryGroup::with(['categories.department'])
            ->where('active', true)
            ->get()
            ->map(function ($group) {
                $group->image_url; // Touch accessor
                return $group;
            });

        // Load product groups with nested products and ratings
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

        // Get departments that have products
        $departments = Department::whereHas('categories.products', fn($q) => $q->filterApproved())
            ->with(['categories' => fn($q) => $q->whereHas('products')])
            ->get();

        // Product search
        $products = ProductSearchService::queryWithKeyword($keyword)->paginate(12);



        // Render home page
        return Inertia::render('Home', [
            'products'        => ProductListResource::collection($products),
            'keyword'         => $keyword,
            'departments'     => $departments,
            'department'      => null,
            'categoryGroups'  => $categoryGroups,
            'productGroups'   => $productGroupsArray,

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

        // Product query filtered by department and optionally category, keyword, max price
        $query = Product::query()
            ->whereHas('category', function ($q) use ($department) {
                $q->where('department_id', $department->id);
            })
            ->filterApproved(
                [$department->id],
                $categoryId ? [$categoryId] : null,
                $maxPrice
            )
            ->with(['category', 'department']);

        if ($keyword) {
            $query->where('title', 'like', "%{$keyword}%");
        }

        // Sorting logic
        if ($sortBy) {
            switch ($sortBy) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                default:
                    $query->latest();
            }
        } else {
            $query->latest();
        }

        $products = $query->paginate(12)->withQueryString();

        // Get categories for selected department that have products
        $categories = $department->categories()
            ->whereHas('products', function ($q) use ($categoryId, $maxPrice, $keyword, $department) {
                $q->filterApproved([$department->id], $categoryId ? [$categoryId] : null, $maxPrice);
                if ($keyword) {
                    $q->where('title', 'like', "%{$keyword}%");
                }
            })
            ->get();


        // // Get all departments that have products (to filter out empty ones)
        $departments = Department::whereHas('categories.products', function ($query) {
            $query->filterApproved();  // only categories with approved products
        })
            ->withCount(['products as products_count' => function ($query) {
                $query->filterApproved();  // count only approved products per department
            }])
            ->with(['categories' => function ($query) {
                $query->whereHas('products', function ($q2) {
                    $q2->filterApproved();  // eager load only categories with approved products
                });
            }])
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

        return Inertia::render('Department/Index', [
            'department' => new DepartmentResource($department),
            'products' => ProductListResource::collection($products),
            'categoryGroups'  => $categoryGroups,
            'productGroups'   => $productGroupsArray,
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
            ->withAvg('reviews', 'rating')->withCount('reviews');; // ✅ Add this line here


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

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Shop/ListProducts', [
            'products' => ProductListResource::collection($products),
            'filters' => [
                'keyword' => $keyword,
                'category_id' => $categoryId,
                'max_price' => $maxPrice,
                'sort_by' => $sortBy,
            ],
            'departments' => $departments,  // send filtered departments only
        ]);
    }
}
