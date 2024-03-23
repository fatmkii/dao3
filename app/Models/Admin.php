<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class Admin extends Model
{
    use HasFactory, SoftDeletes;

    protected $casts = [
        'forums' => 'array',
    ];

    public function User()
    {
        return $this->belongsTo(User::class);
    }
}
