<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    protected $fillable = [
        'email',
        'otp',
        'expired_at',
        'is_verified',
        'attempts',
        'locked_until'
    ];

    protected $casts = [
        'expired_at' => 'datetime',
        'locked_until' => 'datetime',
        'is_verified' => 'boolean',
    ];
}