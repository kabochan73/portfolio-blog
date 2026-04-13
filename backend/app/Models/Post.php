<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    use SoftDeletes;

    // 一括代入を許可するカラム
    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'body',
        'published_at',
    ];

    // カラムの型を自動変換
    protected $casts = [
        'published_at' => 'datetime',
    ];

    // 下書きかどうかを判定するプロパティ
    public function getIsDraftAttribute(): bool
    {
        return is_null($this->published_at);
    }

    // --- リレーション ---

    // 記事は1人のユーザーに属する（多対1）
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // 記事は複数のタグを持つ（多対多）
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }
}
