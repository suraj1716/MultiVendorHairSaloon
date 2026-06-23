<?php

namespace App\Http\Controllers;

use App\Enums\ContactReason;
use App\Enums\ContactReasonEnum;
use App\Models\Contact;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Mail\ContactFormReceived;
use App\Mail\ContactFormConfirmation;
use App\Models\Product;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
class ContactController extends Controller
{
    public function index()
    {
        $contactReasons = array_map(fn($case) => [
            'value' => $case->value,
            'label' => ucfirst(str_replace('_', ' ', $case->value)),
        ], ContactReasonEnum::cases());

        return Inertia::render('Contact', [
            'contactReasons' => $contactReasons,
            'departments' => \App\Models\Department::with([
                'categories' => fn($q) => $q
                    ->select('id', 'name', 'department_id')
                    ->whereHas('products', fn($q) => $q->where('status', 'published')),
                'categories.products' => fn($q) => $q
                    ->select('id', 'title', 'category_id')
                    ->where('status', 'published'),
            ])->whereHas(
                'categories',
                fn($q) =>
                $q->whereHas(
                    'products',
                    fn($q) =>
                    $q->where('status', 'published')
                )
            )->get(['id', 'name', 'slug']),
        ]);
    }


public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'phone' => 'nullable|string|max:20',
        'message' => 'required|string',
        'reason' => 'nullable|string',
        'department' => 'nullable|integer|exists:departments,id',
        'category' => 'nullable|integer|exists:categories,id',
        'product' => 'nullable|integer|exists:products,id',
        'quantity' => 'nullable|integer|min:1',
        'file' => 'nullable|file|max:10048',
    ]);

    $filePath = null;
    if ($request->hasFile('file')) {
        $filePath = $request->file('file')->store('contacts', 'public');
    }

    $contact = Contact::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'] ?? null,
        'message' => $validated['message'],
        'reason' => $validated['reason'] ?? null,
        'department_id' => $validated['department'] ?? null,
        'category_id' => $validated['category'] ?? null,
        'product_id' => $validated['product'] ?? null,
        'quantity' => $validated['quantity'] ?? null,
        'file_path' => $filePath,
    ]);

    // Find the vendor who owns the requested product, if any
    $vendorEmail = null;
    if ($contact->product_id) {
        $product = Product::with('vendor.user')->find($contact->product_id);
        $vendorEmail = $product?->vendor?->user?->email;
    }

    try {
        if ($vendorEmail) {
            Mail::to($vendorEmail)->send(new ContactFormReceived($contact));
        } else {
            // General inquiry with no specific product — fall back to platform admin
            Mail::to(config('mail.admin_notification_email'))->send(new ContactFormReceived($contact));
        }

        Mail::to($contact->email)->send(new ContactFormConfirmation($contact));
    } catch (\Exception $e) {
        Log::error("Failed to send contact form emails for Contact #{$contact->id}: " . $e->getMessage());
    }

    return back()->with('success', 'Your message has been sent.');
}
}
