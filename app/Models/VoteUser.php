<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ModelWithSuffix;

class VoteUser extends ModelWithSuffix
{
    use HasFactory;

    protected $guarded = [];

    public $hidden = [
        'user_id',
        'vote_question_id',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'options_id' => 'array'
    ];

    public function VoteQuestion()
    {
        return $this->belongsTo(VoteQuestion::class);
    }

    public function User()
    {
        return $this->belongsTo(User::class);
    }
}
