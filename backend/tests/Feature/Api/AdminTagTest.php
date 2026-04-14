<?php

namespace Tests\Feature\Api;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTagTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): static
    {
        $user = User::factory()->create();
        return $this->actingAs($user, 'sanctum');
    }

    // ===== GET /api/tags =====

    public function test_タグ一覧を取得できる(): void
    {
        Tag::factory()->count(3)->create();

        $response = $this->getJson('/api/tags');

        $response->assertOk()
                 ->assertJsonCount(3);
    }

    // ===== POST /api/admin/tags =====

    public function test_タグを作成できる(): void
    {
        $response = $this->actingAsAdmin()->postJson('/api/admin/tags', [
            'name'  => 'Laravel',
            'color' => '#FF0000',
        ]);

        $response->assertCreated()
                 ->assertJsonPath('name', 'Laravel');

        $this->assertDatabaseHas('tags', ['name' => 'Laravel']);
    }

    public function test_カラー省略時はデフォルト色が使われる(): void
    {
        $response = $this->actingAsAdmin()->postJson('/api/admin/tags', [
            'name' => 'Next.js',
        ]);

        $response->assertCreated()
                 ->assertJsonPath('color', '#6b7280');
    }

    public function test_同じ名前のタグは作成できない(): void
    {
        Tag::factory()->create(['name' => '重複タグ']);

        $response = $this->actingAsAdmin()->postJson('/api/admin/tags', [
            'name' => '重複タグ',
        ]);

        $response->assertUnprocessable()
                 ->assertJsonValidationErrors(['name']);
    }

    public function test_未認証ではタグを作成できない(): void
    {
        $response = $this->postJson('/api/admin/tags', ['name' => 'Test']);

        $response->assertUnauthorized();
    }

    // ===== DELETE /api/admin/tags/{slug} =====

    public function test_タグを削除できる(): void
    {
        $tag = Tag::factory()->create();

        $response = $this->actingAsAdmin()->deleteJson("/api/admin/tags/{$tag->slug}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('tags', ['id' => $tag->id]);
    }

    public function test_未認証ではタグを削除できない(): void
    {
        $tag = Tag::factory()->create();

        $response = $this->deleteJson("/api/admin/tags/{$tag->slug}");

        $response->assertUnauthorized();
    }
}
