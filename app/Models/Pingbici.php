<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Pingbici extends Model
{
    use HasFactory;

    public $timestamps = false;
    
    protected $fillable = [
        'user_id',
    ];

    protected $hidden = [
        'id',
        'user_id',
    ];

    protected $casts = [
        'title_pingbici' => 'array',
        'content_pingbici' => 'array',
        'fjf_pingbici' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
