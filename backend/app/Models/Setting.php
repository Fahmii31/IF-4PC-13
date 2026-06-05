<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $primaryKey = 'setting_id';

    protected $fillable = [
    'user_id',
    'device_id',
    'tarif_id',
    'batas_daya_watt',
    'batas_biaya',
    'configured_at'
];

    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }

    public function tariff()
    {
        return $this->belongsTo(Tariff::class, 'tarif_id');
    }
}