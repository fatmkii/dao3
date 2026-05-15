<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'binggan' => 'test_' . fake()->unique()->randomNumber(8, true),
            'password' => null,
            'is_custom' => false,
            'is_banned' => false,
            'locked_until' => null,
            'locked_count' => 0,
            'admin' => 0,
            'coin' => 100,
            'coin_in_bank' => 0,
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'admin' => 99,
        ]);
    }

    public function banned(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_banned' => true,
        ]);
    }
}
