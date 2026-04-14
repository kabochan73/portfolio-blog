<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    public function definition(): array
    {
        $title = $this->faker->sentence(4);

        return [
            'user_id'      => User::factory(),
            'title'        => $title,
            'slug'         => Str::slug($title) . '-' . Str::random(6),
            'body'         => $this->faker->paragraphs(3, true),
            'published_at' => now(),
        ];
    }

    // 下書き状態
    public function draft(): static
    {
        return $this->state(['published_at' => null]);
    }
}
