<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class VoteOption extends Model
{
    use HasFactory;

    protected $guarded = [];
    public $hidden = [
        'vote_question_id',
        'created_at',
        'updated_at',
    ];

    public function VoteQuestion()
    {
        return $this->belongsTo(VoteQuestion::class);
    }
}
