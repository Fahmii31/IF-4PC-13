<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reading;

class SensorController extends Controller
{
    /**
     * Data sensor terbaru
     */
    public function latest()
    {
        return response()->json(
            Reading::latest()->first()
        );
    }

    /**
     * Riwayat 20 data terakhir
     */
    public function history()
    {
        return response()->json(
            Reading::latest()
                ->take(20)
                ->get()
                ->reverse()
                ->values()
        );
    }

    /**
     * Semua data sensor
     */
    public function index()
    {
        return response()->json(
            Reading::latest()->get()
        );
    }
}