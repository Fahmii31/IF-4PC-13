<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    // GET NOTIFICATIONS
    public function index()
    {
        // Menyaring berdasarkan user_id yang sedang terautentikasi
        $notifications = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    // CLEAR ALL NOTIFICATIONS
    public function clearAll()
    {
        Notification::where('user_id', Auth::id())->delete();
        return response()->json(['message' => 'All alerts cleared']);
    }

    // STORE NOTIFICATION
    public function store(Request $request)
    {
        $request->validate([
            'device_id' => 'required',
            'jenis_notif' => 'required|string',
            'pesan' => 'required|string',
            'media' => 'required|string',
        ]);

        $notification = Notification::create([
            'user_id' => Auth::id(),
            'device_id' => $request->device_id,
            'jenis_notif' => $request->jenis_notif,
            'pesan' => $request->pesan,
            'media' => $request->media,
            'status_kirim' => true,
        ]);

        return response()->json([
            'success' => true,
            'data' => $notification
        ], 201);
    }
}