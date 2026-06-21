<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Department;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DepartmentCategorySeeder extends Seeder
{
    public function run(): void
    {
        $dept = Department::firstOrCreate(
            ['slug' => 'hair-salon'],
            [
                'name'             => 'Hair Salon',
                'meta_title'       => 'Hair Salon Services',
                'meta_description' => 'Professional hair and beauty services in Sydney',
                'active'           => true,
            ]
        );

        // Flat structure: Department -> Category -> Products (no subcategory nesting)
        $categories = [
            'Hair Straightening',
            'Hair Treatment',
            'Colour & Foils',
            'Hair Cut',
            'Facial',
            'Face Bleach',
            'Threading',
            'Eye Treatment',
            'Waxing',
        ];

        foreach ($categories as $name) {
            Category::firstOrCreate(
                [
                    'name'          => $name,
                    'department_id' => $dept->id,
                    'parent_id'     => null,
                ],
                [
                    'active' => true,
                    'image'  => $this->findLocalImage($name),
                ]
            );
        }
    }

    /**
     * Looks for a source image in database/seeders/images/categories/
     * (where the Pexels fetch script saves files) matching the category
     * name slug. Copies it into storage/app/public/categories/ and
     * returns the relative path for the `image` column.
     */
    private function findLocalImage(string $name): ?string
    {
        $slug = Str::slug($name);
        $sourceDir = base_path('database/seeders/images/categories');
        $extensions = ['jpg', 'jpeg', 'png', 'webp'];

        foreach ($extensions as $ext) {
            $sourcePath = "{$sourceDir}/{$slug}.{$ext}";

            if (file_exists($sourcePath)) {
                $destPath = "categories/{$slug}.{$ext}";

                if (! Storage::disk('public')->exists($destPath)) {
                    Storage::disk('public')->put($destPath, file_get_contents($sourcePath));
                }

                return $destPath;
            }
        }

        return null;
    }
}
