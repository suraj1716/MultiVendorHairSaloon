<?php
namespace App\Services;

use App\Http\Resources\VendorUserResource;
use App\Models\User;
use App\Models\Vendor;


class VendorDetailService
{

 public function getVendorDetails()
    {
         return User::with('vendor')
            ->whereHas('vendor')
            ->first();
    }
}
