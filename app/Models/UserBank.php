<?php

namespace App\Models;

use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    //取出并留下操作记录
    public function bank_withdraw(User $user,  bool $confirm_penalty, bool $forced_by_admin = false)
    {

        if (Carbon::parse($this->expire_date) > Carbon::now()) {
            if ($confirm_penalty == true) {
                $tax_rate = 0.88;
            } else {
                throw new Exception('用户未确认提前取出扣手续费');
            }
        } else {
            $tax_rate = 1;
        }


        try {
            DB::beginTransaction();

            $olo_withdraw = floor($this->olo * $tax_rate);

            if ($tax_rate == 1) {
                $message = sprintf('从粮仓取出:%d个olo', $olo_withdraw);
            } else {
                $message = sprintf('从粮仓取出:%d个olo（因提前支取扣除%d个olo）', $olo_withdraw, $this->olo - $olo_withdraw);
            }

            if ($forced_by_admin == true) {
                //如果被管理员强制操作取出时，变更提示
                $message = '因olo现金不足以罚款，强制' . $message;
            }

            $user->coinChange(
                'normal', //记录类型
                [
                    'olo' =>  $olo_withdraw,
                    'content' =>  $message,
                    'type' => 'bank_in',
                ]
            ); //扣除用户相应olo（通过统一接口、记录操作）

            $this->is_deleted = true;
            $this->withdraw_date = Carbon::now();
            $this->save();

            $user_olo_in_bank = UserBank::where('user_id', $user->id)->where('is_deleted', false)->sum('olo');
            $user->coin_in_bank = $user_olo_in_bank;
            $user->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        if ($tax_rate != 1) {
            //提前支取，计入成就记录
            $user_medal_record = $user->UserMedalRecord()->firstOrCreate();
            $user_medal_record->push_withdraw_penalty($this->olo);
        }

        return [$message, $olo_withdraw];
    }
}
