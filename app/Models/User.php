<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Exceptions\CoinException;
use App\Jobs\ProcessIncomeStatement;
use App\Models\MyEmoji;
use App\Models\UserBank;
use App\Models\UserMedalRecord;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

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
        'is_custom' => 'boolean',
        'is_banned' => 'boolean',
        'use_pingbici' => 'boolean',
        'new_msg' => 'boolean',
    ];

    protected $appends = [
        'locked_ttl',
    ];

    //防灌水相关
    const NEW_THREAD_INTERVAL = 300; //发新主题频率
    const NEW_POST_NUMBER = 10; //饼干回帖次数（也就是60秒10次）
    const NEW_POST_INTERVAL = 60; //饼干回帖检查周期（含大乱斗）
    const NEW_POST_NUMBER_IP = 100; //IP回帖次数（也就是1小时100次）
    const NEW_POST_NUMBER_IP2 = 5; //IP回帖不看帖次数（第3类）
    const NEW_POST_NUMBER_IP3 = 70; //IP回帖方差（第4类）
    const NEW_POST_NUMBER_IP4 = 20; //IP回帖前端的特征码（第5类），每20贴检查1次

    const NEW_POST_INTERVAL_IP = 3600; //IP回帖检查周期（含大乱斗）

    const HONGBAO_INTERVAL = 300; //IP抢红包的检查周期
    const HONGBAO_NUMBER_IP = 6; //IP抢到红包的次数（也就是5分钟6次，第6次弹验证码）

    public function lockedTtl(): Attribute
    {
        if ($this->locked_until != null && Carbon::parse($this->locked_until)->gt(Carbon::now())) {

            $result = Attribute::make(
                get: fn() => Carbon::parse($this->locked_until)->diffInSeconds(Carbon::now(), true),
            );
        } else {
            $result = Attribute::make(
                get: fn() => 0,
            );
        }
        return $result;
    }

    public function adminForums(): Attribute
    {
        return Attribute::make(get: fn() => $this->AdminPermissions->forums);
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
        UserMedalRecord::check_olo_0($this);
    }

    //统一的奥利奥变更接口，并且留下income_statement记录
    public function coinChange(string $action, array $income_statement, bool $ignore_olo_0 = false)
    {
        //检查olo是否足够
        if ($income_statement['olo'] < 0 && $this->coin < -$income_statement['olo']) {
            if ($ignore_olo_0 == false) {
                //如果olo不足，则报错
                throw new CoinException();
            } else {
                //假如忽略olo低于0的情况（用于罚款等情况），检查粮仓是否足够罚款
                $user_banks = UserBank::where('user_id', $this->id)->where('is_deleted', false)->orderBy('expire_date', 'asc')->get();

                if ($user_banks) {
                    //如果有粮仓存款，循环确认要取出多少个粮仓才够罚款
                    $olo_sum = 0;
                    $olo_enough = false;
                    foreach ($user_banks as $key => $user_bank) {
                        list($message, $olo_withdraw) = $user_bank->bank_withdraw($this, true, true); //参数User $user,  bool $confirm_penalty, bool $forced_by_admin = false
                        $olo_sum += $olo_withdraw;
                        if ($olo_sum >= -$income_statement['olo']) {
                            //如果累计粮仓olo已经足够，则跳出循环
                            $olo_enough = true;
                            break;
                        }
                    }
                    Log::debug('$olo_sum', [$olo_sum]);
                    Log::debug('$olo_enough', [$olo_enough]);
                    Log::debug('$$this->coin + $olo_sum', [$this->coin + $olo_sum]);
                    if ($olo_enough == false) {
                        //如果粮仓取完都不够，则把olo扣除到0为止（包括已取出的粮仓存款）
                        $income_statement['olo'] = -$this->coin;
                    }
                } else {
                    //如果连粮仓存款都没有，则直接把剩余olo扣除到0为止
                    $income_statement['olo'] = -$this->coin;
                }
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

        // 操作olo数据
        $this->increment('coin', $income_statement['olo']);
        $this->save();

        //检查成就
        if ($income_statement['olo'] > 0) {
            //只有olo是增加的才需要检查
            UserMedalRecord::check_olo($this);
        } else {
            //检查olo清零的
            UserMedalRecord::check_olo_0($this);
        }
    }

    //获取总olo(现金+银行)
    public function getCoin()
    {
        return $this->coin + $this->coin_in_bank;
    }

    public function MyEmoji()
    {
        return $this->hasOne(MyEmoji::class);
    }

    public function Pingbici()
    {
        return $this->hasOne(Pingbici::class);
    }

    public function UserLV()
    {
        return $this->hasOne(UserLV::class);
    }

    public function AdminPermissions()
    {
        return $this->hasOne(Admin::class);
    }

    public function VoteUser()
    {
        // return $this->hasMany(VoteUser::class);
    }

    public function IncomeStatement()
    {
        return $this->hasMany(IncomeStatement::class);
    }

    public function UserMedal()
    {
        return $this->hasMany(UserMedal::class);
    }


    public function UserMedalRecord()
    {
        return $this->hasOne(UserMedalRecord::class);
    }

    public function MyBattleChara()
    {
        return $this->hasMany(MyBattleChara::class);
    }

    public function EmojiContestUser()
    {
        // return $this->hasMany(EmojiContestUser::class);
    }

    public function UserBank()
    {
        return $this->hasMany(UserBank::class);
    }

    protected function serializeDate($date)
    {
        return $date->format('Y-m-d H:i');
    }
}
