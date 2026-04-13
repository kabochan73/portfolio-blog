<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;

class TagController extends Controller
{
    /**
     * タグ一覧を返す
     */
    public function index(): JsonResponse
    {
        $tags = Tag::orderBy('name')->get(['id', 'name', 'slug', 'color']);

        return response()->json($tags);
    }
}
