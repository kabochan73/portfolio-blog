<?php

use Illuminate\Support\Facades\Route;

// 認証不要（公開API）
Route::get('/health', fn() => response()->json(['status' => 'ok']));
