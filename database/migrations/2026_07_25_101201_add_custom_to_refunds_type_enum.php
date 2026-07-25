<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE refunds MODIFY COLUMN type ENUM('full', 'booking_fee', 'except_booking_fee', 'custom') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE refunds MODIFY COLUMN type ENUM('full', 'booking_fee', 'except_booking_fee') NOT NULL");
    }
};
