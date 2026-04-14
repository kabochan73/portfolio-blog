<?php

namespace Tests\Feature\Api;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    // ===== GET /api/posts =====

    public function test_公開済み記事の一覧を取得できる(): void
    {
        Post::factory()->count(3)->create();
        Post::factory()->draft()->count(2)->create(); // 下書きは含まれない

        $response = $this->getJson('/api/posts');

        $response->assertOk()
                 ->assertJsonCount(3);
    }

    public function test_記事一覧にタグが含まれる(): void
    {
        $tag  = Tag::factory()->create();
        $post = Post::factory()->create();
        $post->tags()->attach($tag);

        $response = $this->getJson('/api/posts');

        $response->assertOk()
                 ->assertJsonPath('0.tags.0.id', $tag->id);
    }

    public function test_下書きは一覧に含まれない(): void
    {
        Post::factory()->draft()->create();

        $response = $this->getJson('/api/posts');

        $response->assertOk()
                 ->assertJsonCount(0);
    }

    // ===== GET /api/posts/{slug} =====

    public function test_公開済み記事の詳細を取得できる(): void
    {
        $post = Post::factory()->create();

        $response = $this->getJson("/api/posts/{$post->slug}");

        $response->assertOk()
                 ->assertJsonStructure(['id', 'title', 'slug', 'body', 'published_at', 'tags'])
                 ->assertJsonPath('slug', $post->slug);
    }

    public function test_下書き記事は詳細を取得できない(): void
    {
        $post = Post::factory()->draft()->create();

        $response = $this->getJson("/api/posts/{$post->slug}");

        $response->assertNotFound();
    }

    public function test_存在しない記事は404を返す(): void
    {
        $response = $this->getJson('/api/posts/not-exist');

        $response->assertNotFound();
    }
}
