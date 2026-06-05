<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $primaryKey = 'device_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'user_id', 'kode_device', 'nama_perangkat', 'is_online', 'status_relay', 'last_seen'
    ];

    // INI WAJIB AGAR TIDAK ERROR SAAT INSERT
    protected $attributes = [
        'is_online'    => 1, // DEFAULT ONLINE
        'status_relay' => 0, // DEFAULT AKTIF
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function setting() { return $this->hasOne(Setting::class, 'device_id'); }
}