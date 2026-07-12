<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GiftCardTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminGiftCardTemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = GiftCardTemplate::withCount('vouchers')->orderBy('sort_order');

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }
        if ($request->filled('active')) {
            $query->where('active', $request->active === '1');
        }

        $templates = $query->paginate(20)->through(fn($t) => [
            'id'             => $t->id,
            'title'          => $t->title,
            'description'    => $t->description,
            'amount'         => $t->amount,
            'image_url'      => $t->getImageUrl(),
            'active'         => $t->active,
            'sort_order'     => $t->sort_order,
            'vouchers_count' => $t->vouchers_count,
        ]);

        return Inertia::render('Admin/GiftCardTemplates/Index', [
            'templates' => $templates,
            'filters'   => $request->only(['search', 'active']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'amount'      => 'required|numeric|min:1',
            'sort_order'  => 'nullable|integer|min:0',
            'image'       => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('gift-card-templates', 'public');
        }

        GiftCardTemplate::create([
            'title'       => $request->title,
            'description' => $request->description,
            'amount'      => $request->amount,
            'sort_order'  => $request->sort_order ?? 0,
            'image_path'  => $imagePath,
            'active'      => true,
        ]);

        return back()->with('success', 'Gift card template created.');
    }

    public function update(Request $request, GiftCardTemplate $giftCardTemplate)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'amount'      => 'required|numeric|min:1',
            'sort_order'  => 'nullable|integer|min:0',
            'active'      => 'boolean',
            'image'       => 'nullable|image|max:2048',
        ]);

        $data = [
            'title'       => $request->title,
            'description' => $request->description,
            'amount'      => $request->amount,
            'sort_order'  => $request->sort_order ?? $giftCardTemplate->sort_order,
            'active'      => $request->boolean('active'),
        ];

        if ($request->hasFile('image')) {
            if ($giftCardTemplate->image_path) {
                Storage::disk('public')->delete($giftCardTemplate->image_path);
            }
            $data['image_path'] = $request->file('image')->store('gift-card-templates', 'public');
        }

        $giftCardTemplate->update($data);

        return back()->with('success', 'Gift card template updated.');
    }

    public function toggle(GiftCardTemplate $giftCardTemplate)
    {
        $giftCardTemplate->update(['active' => !$giftCardTemplate->active]);
        return back()->with('success', 'Template ' . ($giftCardTemplate->active ? 'activated' : 'deactivated') . '.');
    }

    public function destroy(GiftCardTemplate $giftCardTemplate)
    {
        if ($giftCardTemplate->vouchers()->exists()) {
            return back()->with('error', 'Cannot delete a template that has vouchers issued against it. Deactivate it instead.');
        }

        if ($giftCardTemplate->image_path) {
            Storage::disk('public')->delete($giftCardTemplate->image_path);
        }

        $giftCardTemplate->delete();

        return back()->with('success', 'Gift card template deleted.');
    }
}