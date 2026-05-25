<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))

    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware) {

        $middleware->statefulApi();

        $middleware->alias([
            'auth' => \App\Http\Middleware\Authenticate::class,
        ]);

    })

    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (ValidationException $e, $request) {

            return response()->json([
                'message' => 'Validation Failed',
                'errors' => $e->errors()
            ], 422);

        });

        $exceptions->render(function (AuthenticationException $e, $request) {

            return response()->json([
                'message' => 'Unauthorized'
            ], 401);

        });

    })

    ->create();