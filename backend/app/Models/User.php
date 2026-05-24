<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
    'username',
    'email',
    'password',
    'phone',
    'provider',
    'provider_id',
    'is_google_user'
];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}