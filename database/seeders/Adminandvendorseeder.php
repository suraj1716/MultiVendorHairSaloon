<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminAndVendorSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin ──────────────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@hairsalon.com'],
            [
                'name'              => 'Salon Admin',
                'password'          => Hash::make('password'),
                'email_verified_at' => now(),
                'referral_code'     => strtoupper(Str::random(8)),
            ]
        );
        $admin->assignRole('Admin');

        // ── Vendor (Hair Salon Owner) ──────────────────────────
        $vendorUser = User::firstOrCreate(
            ['email' => 'owner@hairsalon.com'],
            [
                'name'              => 'Salon Owner',
                'password'          => Hash::make('password'),
                'email_verified_at' => now(),
                'referral_code'     => strtoupper(Str::random(8)),
            ]
        );
        $vendorUser->assignRole('Vendor');

        Vendor::firstOrCreate(
            ['user_id' => $vendorUser->id],
            [
                'status'                  => 'approved',
                'store_name'              => 'Glamour Hair Salon',
                'store_address'           => '123 George Street, Sydney NSW 2000',
                'vendor_type'             => 'appointment',
                'booking_fee'             => 20.00,
                'business_start_time'     => '09:00:00',
                'business_end_time'       => '18:00:00',
                'slot_interval_minutes'   => 30,
                'recurring_closed_days'   => json_encode([0, 6]), // Sunday=0, Saturday=6
                'closed_dates'            => json_encode([]),
            ]
        );
    }
}
