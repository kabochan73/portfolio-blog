<?php

use App\Http\Controllers\Api\AdminPostController;
use App\Http\Controllers\Api\AdminTagController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\TagController;
use Illuminate\Support\Facades\Route;

// ヘルスチェック
Route::get('/health', fn() => response()->json(['status' => 'ok']));

// 認証
Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/auth/logout', [AuthController::class, 'logout']);

// 公開API（認証不要）
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{slug}', [PostController::class, 'show']);
Route::get('/tags', [TagController::class, 'index']);

// 管理者API（要認証）
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/posts', [AdminPostController::class, 'index']);
    Route::post('/posts', [AdminPostController::class, 'store']);
    Route::put('/posts/{slug}', [AdminPostController::class, 'update']);
    Route::delete('/posts/{slug}', [AdminPostController::class, 'destroy']);

    Route::post('/tags', [AdminTagController::class, 'store']);
    Route::delete('/tags/{slug}', [AdminTagController::class, 'destroy']);
});
