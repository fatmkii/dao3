<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Exceptions\CoinException;
use App\Jobs\ProcessIncomeStatement;

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

    //消费奥利奥并检查是否足够（用于不留下income_statement的操作）
    public function coinConsume(int $coin)
    {
        if ($this->coin < $coin) {
            throw new CoinException();
        }
        // $this->coin -= $coin;
        $this->increment('coin', -$coin);
        $this->save();

        //检查olo是否清零的成就
        // UserMedalRecord::check_olo_0($this);
    }

    //统一的奥利奥变更接口，并且留下income_statement记录
    public function coinChange(string $action = "normal", array $income_statement, bool $ignore_olo_0 = false)
    {
        //检查olo是否足够
        if ($income_statement['olo'] < 0 && $this->coin < -$income_statement['olo']) {
            if ($ignore_olo_0 == false) {
                //如果olo不足，则报错
                throw new CoinException();
            } else {
                //假如忽略olo低于0的情况（用于罚款等情况），直接把剩余olo扣除到0为止
                $income_statement['olo'] = -$this->coin;
            }
        }

        //如果没有传入user_id、binggan、created_at，则使用此模型的饼干（简化传参）
        if (!array_key_exists('user_id', $income_statement)) {
            $income_statement['user_id'] = $this->id;
        }
        if (!array_key_exists('binggan', $income_statement)) {
            $income_statement['binggan'] = $this->binggan;
        }
        if (!array_key_exists('created_at', $income_statement)) {
            $income_statement['created_at'] = Carbon::now();
        }

        //执行异步的队列，记录olo变动操作
        ProcessIncomeStatement::dispatch($action, $income_statement);

        // $this->coin += $income_statement['olo'];
        $this->increment('coin', $income_statement['olo']);
        $this->save();

        //检查成就
        // if ($income_statement['olo'] > 0) {
        //     //只有olo是增加的才需要检查
        //     UserMedalRecord::check_olo($this);
        // } else {
        //     //检查olo清零的
        //     UserMedalRecord::check_olo_0($this);
        // }
    }
}
