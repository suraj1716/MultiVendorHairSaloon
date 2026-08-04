<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductListResource;
use App\Models\Category;
use App\Models\CategoryGroup;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{

  public function show(Category $category)
{
    $category->load('department');

    $products = Product::query()
        ->where('category_id', $category->id)
        ->filterApproved()
        ->with([
            'department',
            'user.vendor',
            'variationTypes.options.media',
            'variations',
            'media',
            'reviews.user',
        ])
        ->withAvg('reviews', 'rating')
        ->withCount('reviews')
        ->latest()
        ->paginate(12)
        ->withQueryString();

    $groups = CategoryGroup::with([
        'categories' => function ($query) {
            $query->select(
                'categories.id',
                'categories.name',
                'categories.image',
                'categories.department_id',
                'categories.parent_id',
                'categories.active'
            )->with('department');
        }
    ])->where('active', true)->get();

    return Inertia::render('Category/Show', [
        'category' => $category,
        'department' => $category->department,
        'products' => ProductListResource::collection($products),
        'categoryGroups' => $groups,
    ]);
}





Claude finished the response
Like in ecom , there all prods in home page and searching.....when user click, vendor id can be fetched that made the product....i think that feature is also here, dont know where....


Investigated vendor ID parameter capture during product selection
Investigated vendor ID parameter capture during product selection
That feature is very likely there — it'd show up as a "View Vendor" / vendor storefront link somewhere on a product card or product detail page (e.g. "Sold by [Vendor Name]" → clicking goes to a vendor profile route with that vendor's products). That's a different flow than the category modal, though: there, the vendor is captured from a product (product.created_by → vendor), not from a category.

Rather than guess where that lives, let's find it directly:


Placeholder
Placeholder
I don't have access to your actual codebase/repo here — I can only work with what you paste in. So to find this existing vendor-link feature, either:

Search your own project for the route name pattern — try grepping for something like vendor.show, vendor.profile, or Route::get('/vendor in routes/web.php, and Sold by or vendor.name in your product card/detail .tsx files. That'll show you the exact route + controller already doing this.
Paste the product card or product detail component (wherever a single product is displayed with buy/add-to-cart) — if there's a vendor link, it'll be visible there, and I can trace it back to the controller.
Once we see that existing flow, I can tell you definitively whether it's reusable for the category modal, or whether (as I suspect) it's product→vendor specific and doesn't map onto category→vendor the way you're hoping, since categories can span multiple vendors in this schema.

Which would you rather do — grep your own repo for the route name, or paste the product card component?

Not working...another ref <?php
namespace App\Http\Controllers;
use App\Http\Resources\ProductListResource;
use App\Models\Category;
use App\Models\CategoryGroup;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
class CategoryController extends Controller
{
  public function show(Category $category)
{
    $category->load('department');
    $products = Product::query()
        ->where('category_id', $category->id)
        ->filterApproved()
        ->with([
            'department',
            'user.vendor',
            'variationTypes.options.media',
            'variations',
            'media',
            'reviews.user',
        ])
        ->withAvg('reviews', 'rating')
        ->withCount('reviews')
        ->latest()
        ->paginate(12)
        ->withQueryString();
    $groups = CategoryGroup::with([
        'categories' => function ($query) {
            $query->select(
                'categories.id',
                'categories.name',
                'categories.image',
                'categories.department_id',
                'categories.parent_id',
                'categories.active'
            )->with('department');
        }
    ])->where('active', true)->get();
    return Inertia::render('Category/Show', [
        'category' => $category,
        'department' => $category->department,
        'products' => ProductListResource::collection($products),
        'categoryGroups' => $groups,
    ]);
}
public function products(Category $category)
{
    $products = Cache::remember("category:{$category->id}:products", 300, function () use ($category) {
        return $category->products()
            ->where('status', 'published')
            ->get();
    });
    return response()->json([
        'products' => ProductListResource::collection($products),
    ]);
}
}

Show more

Identified missing Cache import and referenced existing pattern
Identified missing Cache import and referenced existing pattern
This is really useful — you already have the exact pattern to follow, right in the same controller: show() uses filterApproved() (not forWebsite(), not a bare status check), and loads user.vendor so vendor info travels with each product. That's your existing convention for "category → its products," and it already resolves the vendor question — no need to derive vendor from category at all, since each product carries its own vendor via user.vendor.

Also — I spotted the actual bug causing "not working" right now: your products() method uses Cache:: but there's no use Illuminate\Support\Facades\Cache; import in this file. That's a fatal Class "App\Http\Controllers\Cache" not found error, which would 500 every time this method runs — matching everything you've been seeing.

Fix both at once, matching your existing show() conventions:

php
<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProductListResource;
use App\Models\Category;
use App\Models\CategoryGroup;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function show(Category $category)
    {
        // unchanged...
    }

    public function products(Category $category)
    {
        $products = Cache::remember("category:{$category->id}:products", 300, function () use ($category) {
            return $category->products()
                ->filterApproved()
                ->with(['user.vendor'])
                ->withAvg('reviews', 'rating')
                ->withCount('reviews')
                ->latest()
                ->get();
        });

        return response()->json([
            'products' => ProductListResource::collection($products),
        ]);
    }
}
