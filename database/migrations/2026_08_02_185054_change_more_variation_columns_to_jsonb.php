<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
 public function up(): void
{
    DB::statement('ALTER TABLE product_variations ALTER COLUMN variation_type_option_ids TYPE jsonb USING variation_type_option_ids::jsonb');
    DB::statement('ALTER TABLE order_items ALTER COLUMN variation_type_option_ids TYPE jsonb USING variation_type_option_ids::jsonb');
}

public function down(): void
{
    DB::statement('ALTER TABLE product_variations ALTER COLUMN variation_type_option_ids TYPE json USING variation_type_option_ids::json');
    DB::statement('ALTER TABLE order_items ALTER COLUMN variation_type_option_ids TYPE json USING variation_type_option_ids::json');
}
};
