<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\ModelWithSuffix;
use App\Models\GambleQuestion;
use App\Models\User;

class GambleUser extends ModelWithSuffix
{
    use HasFactory;

    protected $guarded = [];

    public $hidden = [
        'user_id',
        'gamble_question_id',
        'created_at',
        'updated_at',
    ];

    public function GambleQuestion()
    {
        return $this->belongsTo(GambleQuestion::class);
    }

    public function User()
    {
        return $this->belongsTo(User::class);
    }
}
