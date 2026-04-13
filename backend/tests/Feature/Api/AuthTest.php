<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    // テストごとにDBをリセットする
    use RefreshDatabase;

    // ===== ログインのテスト =====

    public function test_正しい認証情報でログインできる(): void
    {
        User::factory()->create([
            'email'    => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email'    => 'admin@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()                        // ステータス200
                 ->assertJsonStructure([             // レスポンスの形を確認
                     'token',
                     'user' => ['id', 'name', 'email'],
                 ])
                 ->assertJsonPath('user.email', 'admin@example.com');
    }

    public function test_間違ったパスワードでログインできない(): void
    {
        User::factory()->create([
            'email'    => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email'    => 'admin@example.com',
            'password' => 'wrong_password',
        ]);

        $response->assertUnprocessable()            // ステータス422
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_メールアドレスが空だとバリデーションエラー(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email'    => '',
            'password' => 'password',
        ]);

        $response->assertUnprocessable()
                 ->assertJsonValidationErrors(['email']);
    }

    // ===== ログアウトのテスト =====

    public function test_ログイン済みユーザーがログアウトできる(): void
    {
        $user  = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withToken($token)        // トークンをヘッダーにセット
                         ->postJson('/api/auth/logout');

        $response->assertOk()
                 ->assertJsonPath('message', 'ログアウトしました。');

        // トークンがDBから削除されていることを確認
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_未認証ユーザーはログアウトできない(): void
    {
        $response = $this->postJson('/api/auth/logout');

        $response->assertUnauthorized(); // ステータス401
    }
}
