<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GalleryController extends Controller
{
    public function index(): \Inertia\Response
    {
        $galleryItems = Gallery::with('media')
        ->where('active', true)
        ->latest()
        ->get();

        return Inertia::render('Gallery/Index', [
            'galleryItems' => $galleryItems->map(fn($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'images' => $item->getMedia('gallery')->map(fn($media) => [
                    'url' => $media->getFullUrl(),
                    'id' => $media->id,
                ]),
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $gallery = Gallery::create([
            'title' => $data['title'],
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $gallery->addMedia($image)->toMediaCollection('gallery');
            }
        }

        return redirect()->back();
    }
}
