<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reading extends Model
{
    protected $primaryKey = 'reading_id';

    protected $fillable = [
        'device_id',
        'arus_ampere',
        'tegangan_volt',
        'daya_watt',
        'energi_kwh',
        'estimasi_biaya'
    ];

    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }
}