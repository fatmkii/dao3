<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HongbaoPostUser extends Model
{
    use HasFactory;

    protected $table = "hongbao_post_users";

    public $timestamps = false;

    public $hidden = [
        'hongbao_post_id',
        'user_id',
        'created_at',
    ];

    public $fillable = [
        'hongbao_post_id',
        'user_id',
        'olo',
        'floor',
        'created_at',
    ];

    public function HongbaoPost()
    {
        return $this->belongsTo(HongbaoPost::class);
    }
}
