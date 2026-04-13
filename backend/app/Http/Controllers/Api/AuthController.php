<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * ログイン
     */
    public function login(Request $request): JsonResponse
    {
        // バリデーション（入力値の検証）
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        // メール・パスワードの照合
        if (!Auth::attempt($request->only('email', 'password'))) {
            // 認証失敗 → 422エラー
            throw ValidationException::withMessages([
                'email' => ['メールアドレスまたはパスワードが正しくありません。'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();

        // 既存トークンを全削除してから新しいトークンを発行
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * ログアウト
     */
    public function logout(Request $request): JsonResponse
    {
        // 現在使っているトークンを削除
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'ログアウトしました。']);
    }
}
