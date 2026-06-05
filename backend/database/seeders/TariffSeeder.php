<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tariff;

class TariffSeeder extends Seeder
{
    public function run(): void
    {
        Tariff::insert([
    [
        'daya_va' => 450,
        'tarif_per_kwh' => 415,
    ],
    [
        'daya_va' => 900,
        'tarif_per_kwh' => 1352,
    ],
    [
        'daya_va' => 1300,
        'tarif_per_kwh' => 1444.70,
    ],
    [
        'daya_va' => 2200,
        'tarif_per_kwh' => 1444.70,
    ],
    [
        'daya_va' => 3500,
        'tarif_per_kwh' => 1699.53,
    ],
]);
    }
}