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
    'is_cost_alert_active',
    'last_cost_alert_month',
    'is_power_alert_active',
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