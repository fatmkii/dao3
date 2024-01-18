<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use Carbon\Carbon;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'binggan',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'id',
        'binggan',
        'admin',
        'password',
        'created_location',
        'created_UUID',
        'is_custom',
        'last_login',
        'locked_count',
        'created_ip',
        'created_at',
        'updated_at',
        'is_banned',
        'locked_until',
        'AdminPermissions',
        'pingbici',
        'MyEmoji',
        'UserLV',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'binggan_verified_at' => 'datetime',
        'last_login' => 'datetime',
    ];

    protected $appends = [
        'locked_ttl',
    ];

    public function lockedTtl(): Attribute
    {
        if ($this->locked_until != null && Carbon::parse($this->locked_until)->gt(Carbon::now())) {

            $result = Attribute::make(
                get: fn () => Carbon::parse($this->locked_until)->diffInSeconds(Carbon::now(), true),
            );
        } else {
            $result = Attribute::make(
                get: fn () => 0,
            );
        }
        return $result;
    }

    public function AdminPermissions()
    {
        return $this->hasOne(Admin::class);
    }

    public function adminForums(): Attribute
    {
        return Attribute::make(get: fn () => $this->AdminPermissions->forums);
    }
}
