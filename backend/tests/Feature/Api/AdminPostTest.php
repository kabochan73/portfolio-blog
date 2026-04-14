<?php

namespace Tests\Feature\Api;

use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPostTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): static
    {
        $user = User::factory()->create();
        return $this->actingAs($user, 'sanctum');
    }

    // ===== GET /api/admin/posts =====

    public function test_管理者は全記事を取得できる(): void
    {
        Post::factory()->count(2)->create();
        Post::factory()->draft()->count(2)->create();

        $response = $this->actingAsAdmin()->getJson('/api/admin/posts');

        $response->assertOk()
                 ->assertJsonCount(4);
    }

    public function test_未認証では記事一覧を取得できない(): void
    {
        $response = $this->getJson('/api/admin/posts');

        $response->assertUnauthorized();
    }

    // ===== POST /api/admin/posts =====

    public function test_記事を公開状態で作成できる(): void
    {
        $response = $this->actingAsAdmin()->postJson('/api/admin/posts', [
            'title'        => 'テスト記事',
            'body'         => '本文です',
            'published_at' => now()->toISOString(),
        ]);

        $response->assertCreated()
                 ->assertJsonPath('title', 'テスト記事');

        $this->assertDatabaseHas('posts', ['title' => 'テスト記事']);
    }

    public function test_記事を下書きで作成できる(): void
    {
        $response = $this->actingAsAdmin()->postJson('/api/admin/posts', [
            'title'        => '下書き記事',
            'body'         => '本文です',
            'published_at' => null,
        ]);

        $response->assertCreated()
                 ->assertJsonPath('published_at', null);
    }

    public function test_タグ付きで記事を作成できる(): void
    {
        $tags = Tag::factory()->count(2)->create();

        $response = $this->actingAsAdmin()->postJson('/api/admin/posts', [
            'title'   => 'タグあり記事',
            'body'    => '本文です',
            'tag_ids' => $tags->pluck('id')->toArray(),
        ]);

        $response->assertCreated();
        $this->assertCount(2, Post::first()->tags);
    }

    public function test_タイトルなしでは記事を作成できない(): void
    {
        $response = $this->actingAsAdmin()->postJson('/api/admin/posts', [
            'body' => '本文です',
        ]);

        $response->assertUnprocessable()
                 ->assertJsonValidationErrors(['title']);
    }

    // ===== PUT /api/admin/posts/{slug} =====

    public function test_記事を更新できる(): void
    {
        $post = Post::factory()->create();

        $response = $this->actingAsAdmin()->putJson("/api/admin/posts/{$post->slug}", [
            'title' => '更新後のタイトル',
        ]);

        $response->assertOk()
                 ->assertJsonPath('title', '更新後のタイトル');
    }

    public function test_下書きを公開できる(): void
    {
        $post = Post::factory()->draft()->create();

        $response = $this->actingAsAdmin()->putJson("/api/admin/posts/{$post->slug}", [
            'published_at' => now()->toISOString(),
        ]);

        $response->assertOk();
        $this->assertNotNull($post->fresh()->published_at);
    }

    // ===== DELETE /api/admin/posts/{slug} =====

    public function test_記事を削除できる(): void
    {
        $post = Post::factory()->create();

        $response = $this->actingAsAdmin()->deleteJson("/api/admin/posts/{$post->slug}");

        $response->assertNoContent();
        $this->assertSoftDeleted('posts', ['id' => $post->id]);
    }

    public function test_未認証では記事を削除できない(): void
    {
        $post = Post::factory()->create();

        $response = $this->deleteJson("/api/admin/posts/{$post->slug}");

        $response->assertUnauthorized();
    }
}
