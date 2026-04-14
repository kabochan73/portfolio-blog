<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminTagController extends Controller
{
    /**
     * タグ作成
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:20|unique:tags,name',
            'color' => 'nullable|string|max:7',
        ]);

        $tag = Tag::create([
            'name'  => $validated['name'],
            'slug'  => Str::slug($validated['name']),
            'color' => $validated['color'] ?? '#6b7280',
        ]);

        return response()->json($tag, 201);
    }

    /**
     * タグ削除
     */
    public function destroy(string $slug): JsonResponse
    {
        $tag = Tag::where('slug', $slug)->firstOrFail();
        $tag->delete();

        return response()->json(null, 204);
    }
}
