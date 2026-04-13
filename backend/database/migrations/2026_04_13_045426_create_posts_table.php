<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();                                  // BIGINT, AUTO INCREMENT, PRIMARY KEY
            $table->foreignId('user_id')                   // BIGINT（usersテーブルへの外部キー）
                  ->constrained()                          // users.idを参照
                  ->cascadeOnDelete();                     // ユーザー削除時に記事も削除
            $table->string('title');                       // VARCHAR(255) タイトル
            $table->string('slug')->unique();              // VARCHAR(255) URL用（一意）
            $table->longText('body');                      // 本文（Markdown）
            $table->timestamp('published_at')->nullable(); // NULLなら下書き
            $table->timestamps();                          // created_at / updated_at
            $table->softDeletes();                         // deleted_at（ソフトデリート）
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
