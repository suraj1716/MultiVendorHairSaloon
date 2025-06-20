<?php

namespace App\Http\Controllers;

use App\Enums\ContactReason;
use App\Enums\ContactReasonEnum;
use App\Models\Contact;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

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
        ]);
    }

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'message' => 'required|string',
        'reason' => 'nullable|string',
        'department' => 'nullable|integer|exists:departments,id',
        'category' => 'nullable|integer|exists:categories,id',
        'product' => 'nullable|integer|exists:products,id',
        'quantity' => 'nullable|integer|min:1',
        'file' => 'nullable|file|max:2048', // max 2MB
    ]);

    $filePath = null;

    if ($request->hasFile('file')) {
        $filePath = $request->file('file')->store('contacts', 'public'); // saves to storage/app/public/contacts
    }

    Contact::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'message' => $validated['message'],
        'reason' => $validated['reason'] ?? null,
        'department_id' => $validated['department'] ?? null,
        'category_id' => $validated['category'] ?? null,
        'product_id' => $validated['product'] ?? null,
        'quantity' => $validated['quantity'] ?? null,
        'file_path' => $filePath,

    ]);

    return back()->with('success', 'Your message has been sent.');
}
}
