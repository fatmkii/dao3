<?php

namespace App\Models;

use App\Facades\GlobalSetting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class Hongbao extends Model
{
    use HasFactory;

    protected $user_id = 0; //用于查询是否已经领取过红包的数据

    protected $table = 'hongbao';

    public $hidden = [
        'thread_id',
        'user_id',
        'olo_remains',
        'created_binggan',
        'created_at',
        'updated_at',
        'message_json',
        'message',
    ];

    protected $appends = [
        'hongbao_user',
    ];

    protected $casts = [
        'olo_hide' => 'boolean',
        'message_json' => 'array',
    ];

    public function HongbaoUser()
    {
        return $this->hasMany(HongbaoUser::class);
    }

    public function Thread()
    {
        return $this->belongsTo(Thread::class);
    }

    protected function serializeDate($date)
    {
        return $date->format('Y-m-d H:i');
    }

    public function setUserID($user_id)
    {
        $this->user_id = $user_id;
    }

    public function getHongbaoUserAttribute()
    {
        if ($this->user_id != 0) {
            $hongbao_user = HongbaoUser::where('user_id', $this->user_id)->where('hongbao_id', $this->id)->first();

            if ($hongbao_user) {
                return $hongbao_user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }


    public function getOloTotalAttribute($olo_total)
    {
        if ($this->olo_hide) {
            //隐藏olo总额
            return null;
        } else {
            return $olo_total;
        }
    }

    public static function create(Request $request, $thread_id)
    {
        $request->validate([
            'hongbao_params.olo' => 'required|integer|min:20000|max:2000000',
            'hongbao_params.num' => 'required|integer|min:10|max:600',
            'hongbao_params.type' => 'required|integer',
            'hongbao_params.keyword' => 'required|string|max:255',
            'hongbao_params.message' => 'nullable|array|max:255',
            'hongbao_params.olo_hide' => 'nullable|boolean',
            'hongbao_params.loudspeaker' => 'nullable|boolean',
        ]);

        $user = $request->user();

        $tax_rate = GlobalSetting::get_tax('normal');
        $coin_pay = ceil($request->hongbao_params['olo'] * $tax_rate);
        $user->coinChange(
            'normal', //记录类型
            [
                'olo' => -$coin_pay,
                'content' => '发起红包主题',
                'thread_id' => $thread_id,
                'thread_title' => $request->title,
            ]
        ); //扣除用户相应olo（通过统一接口、记录操作）

        $hongbao = new Hongbao();
        $hongbao->thread_id = $thread_id;
        $hongbao->olo_total = $request->hongbao_params['olo'];
        $hongbao->num_total = $request->hongbao_params['num'];
        $hongbao->olo_remains = $request->hongbao_params['olo'];
        $hongbao->num_remains = $request->hongbao_params['num'];
        $hongbao->type = $request->hongbao_params['type'];
        $hongbao->key_word = $request->hongbao_params['keyword'];
        // $hongbao->message = $request->hongbao_params['message'];
        $hongbao->message = null; //3.0后改成直接使用使用下面message_json，前端提交的是string[]
        $hongbao->message_json = $request->hongbao_params['message'];
        $hongbao->olo_hide = $request->hongbao_params['olo_hide'];
        $hongbao->save();

        if ($request->hongbao_params['loudspeaker']) {
            //如果有设定自动发大喇叭，就发大喇叭
            $effective_date = Carbon::now();
            $expire_date = $effective_date->copy()->addDays(1); //记得copy否则会影响原变量
            $loudspeaker = Loudspeaker::create([
                'sub_id' => 1,
                'user_id' => $user->id,
                'created_binggan' => $user->binggan,
                'content' => $request->title,
                'thread_id' => $thread_id,
                'effective_date' => $effective_date,
                'expire_date' => $expire_date,
            ]);
        }

        $user_medal_record = $user->UserMedalRecord()->firstOrCreate();
        $user_medal_record->push_hongbao_out($request->hongbao_params['olo']);

        return $hongbao;
    }
}
