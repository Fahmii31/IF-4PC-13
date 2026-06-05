<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    protected $primaryKey = 'history_id';

    protected $fillable = [
        'device_id',
        'tanggal',
        'total_kwh',
        'arus_ampere',    // Tambahan
        'tegangan_volt',  // Tambahan
        'daya_watt',      // Tambahan
        'total_biaya'
    ];

    public function device()
    {
        return $this->belongsTo(Device::class, 'device_id');
    }
}