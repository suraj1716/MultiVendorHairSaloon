<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE refunds DROP CONSTRAINT IF EXISTS refunds_type_check");
        DB::statement("ALTER TABLE refunds ALTER COLUMN type TYPE VARCHAR(255)");
        DB::statement("ALTER TABLE refunds ADD CONSTRAINT refunds_type_check CHECK (type IN ('full', 'booking_fee', 'except_booking_fee', 'custom'))");
        DB::statement("ALTER TABLE refunds ALTER COLUMN type SET NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE refunds DROP CONSTRAINT IF EXISTS refunds_type_check");
        DB::statement("ALTER TABLE refunds ADD CONSTRAINT refunds_type_check CHECK (type IN ('full', 'booking_fee', 'except_booking_fee'))");
        DB::statement("ALTER TABLE refunds ALTER COLUMN type SET NOT NULL");
    }
};
