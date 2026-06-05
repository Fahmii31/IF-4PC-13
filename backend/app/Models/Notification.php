<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $primaryKey = 'notif_id';

    protected $fillable = [
        'user_id',
        'device_id',
        'jenis_notif',
        'pesan',
        'media',
        'status_kirim'
    ];

    public function user()
{
    return $this->belongsTo(User::class, 'user_id');
}

public function device()
{
    return $this->belongsTo(Device::class, 'device_id');
}
}