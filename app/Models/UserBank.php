<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBank extends Model
{
    use HasFactory;


    protected $table = 'user_bank';

    public $hidden = [
        'user_id',
        'updated_at',
        'withdraw_date',
        'is_deleted'
    ];

    protected $fillable = [
        'user_id',
        'olo',
        'description',
        'expire_date',
    ];

    protected function serializeDate($date)
    {
        return $date->format('Y-m-d H:i:s');
    }


    public function User()
    {
        return $this->belongsTo(User::class);
    }
}
