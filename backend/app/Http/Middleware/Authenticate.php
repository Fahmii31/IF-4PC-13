<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Disable redirect for API (return JSON instead)
     */
    protected function redirectTo(Request $request): ?string
    {
        return null;
    }
}