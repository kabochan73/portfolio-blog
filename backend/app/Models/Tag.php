<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'color',
    ];

    // タグは複数の記事を持つ（多対多）
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }
}
