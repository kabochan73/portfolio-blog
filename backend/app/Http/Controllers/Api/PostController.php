<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    /**
     * 公開済み記事の一覧を返す
     */
    public function index(): JsonResponse
    {
        $posts = Post::query()
            ->with('tags')                          // タグを一緒に取得（N+1問題対策）
            ->whereNotNull('published_at')          // 公開済みのみ
            ->orderByDesc('published_at')           // 新しい順
            ->get()
            ->map(fn($post) => [                    // 必要なカラムだけ整形して返す
                'id'           => $post->id,
                'title'        => $post->title,
                'slug'         => $post->slug,
                'published_at' => $post->published_at,
                'tags'         => $post->tags->map(fn($tag) => [
                    'id'    => $tag->id,
                    'name'  => $tag->name,
                    'slug'  => $tag->slug,
                    'color' => $tag->color,
                ]),
            ]);

        return response()->json($posts);
    }

    /**
     * 記事の詳細を返す
     */
    public function show(string $slug): JsonResponse
    {
        $post = Post::query()
            ->with('tags')
            ->whereNotNull('published_at')
            ->where('slug', $slug)
            ->firstOrFail();                        // 見つからなければ404を返す

        return response()->json([
            'id'           => $post->id,
            'title'        => $post->title,
            'slug'         => $post->slug,
            'body'         => $post->body,
            'published_at' => $post->published_at,
            'tags'         => $post->tags->map(fn($tag) => [
                'id'    => $tag->id,
                'name'  => $tag->name,
                'slug'  => $tag->slug,
                'color' => $tag->color,
            ]),
        ]);
    }
}
