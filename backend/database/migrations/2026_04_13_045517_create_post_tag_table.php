<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 中間テーブルはid・timestampsは不要
        Schema::create('post_tag', function (Blueprint $table) {
            $table->foreignId('post_id')
                  ->constrained()
                  ->cascadeOnDelete(); // 記事削除時にタグの紐づきも削除
            $table->foreignId('tag_id')
                  ->constrained()
                  ->cascadeOnDelete(); // タグ削除時に紐づきも削除
            $table->primary(['post_id', 'tag_id']); // 複合主キー（同じ組み合わせは登録不可）
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_tag');
    }
};
