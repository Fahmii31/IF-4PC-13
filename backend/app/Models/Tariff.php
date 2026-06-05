<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tariff extends Model
{
    protected $primaryKey = 'tarif_id';

    protected $fillable = [
        'daya_va',
        'tarif_per_kwh'
    ];
}