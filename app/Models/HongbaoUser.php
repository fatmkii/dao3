<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HongbaoUser extends Model
{
    use HasFactory;

    public $timestamps = false;

    public $hidden = [
        'hongbao_id',
        'user_id',
    ];

    public function Hongbao()
    {
        return $this->belongsTo(Hongbao::class);
    }

    protected function serializeDate($date)
    {
        return $date->format('Y-m-d H:i');
    }
}
