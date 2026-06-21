<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccuseReason extends Model
{
    use HasFactory;

    protected $fillable = [
        'accuse_id',
        'post_id',
        'loudspeaker_id',
        'reporter_user_id',
        'reason',
    ];

    protected $hidden = [
        'reporter_user_id',
        'updated_at',
    ];

    public function accuse()
    {
        return $this->belongsTo(Accuse::class);
    }

    protected function serializeDate($date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
