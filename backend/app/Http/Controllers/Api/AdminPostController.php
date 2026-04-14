<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminPostController extends Controller
{
    /**
     * 記事作成（下書き・公開どちらも対応）
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:30',
            'body'         => 'required|string',
            'published_at' => 'nullable|date',
            'tag_ids'      => 'nullable|array',
            'tag_ids.*'    => 'integer|exists:tags,id',
        ]);

        $post = Post::create([
            'user_id'      => $request->user()->id,
            'title'        => $validated['title'],
            'slug'         => Str::slug($validated['title']) . '-' . Str::random(6),
            'body'         => $validated['body'],
            'published_at' => $validated['published_at'] ?? null,
        ]);

        if (!empty($validated['tag_ids'])) {
            $post->tags()->sync($validated['tag_ids']);
        }

        return response()->json($post->load('tags'), 201);
    }

    /**
     * 記事更新
     */
    public function update(Request $request, string $slug): JsonResponse
    {
        $post = Post::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'title'        => 'sometimes|string|max:30',
            'body'         => 'sometimes|string',
            'published_at' => 'nullable|date',
            'tag_ids'      => 'nullable|array',
            'tag_ids.*'    => 'integer|exists:tags,id',
        ]);

        $post->update([
            'title'        => $validated['title'] ?? $post->title,
            'body'         => $validated['body'] ?? $post->body,
            'published_at' => array_key_exists('published_at', $validated)
                ? $validated['published_at']
                : $post->published_at,
        ]);

        if (array_key_exists('tag_ids', $validated)) {
            $post->tags()->sync($validated['tag_ids'] ?? []);
        }

        return response()->json($post->load('tags'));
    }

    /**
     * 記事削除（ソフトデリート）
     */
    public function destroy(string $slug): JsonResponse
    {
        $post = Post::where('slug', $slug)->firstOrFail();
        $post->delete();

        return response()->json(null, 204);
    }
}
