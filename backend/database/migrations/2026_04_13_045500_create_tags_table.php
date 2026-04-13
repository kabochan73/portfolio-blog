<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();   // タグ名（例: "Laravel"）
            $table->string('slug')->unique();   // URL用（例: "laravel"）
            $table->string('color', 7);         // 16進数カラーコード（例: "#3B82F6"）
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
