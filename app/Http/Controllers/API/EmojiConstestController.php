<?php

namespace App\Http\Controllers\API;

use App\Common\ResponseCode;
use App\Http\Controllers\Controller;
use App\Models\EmojiContest;
use App\Models\EmojiContestUser;
use App\Models\EmojiContestUserTotal;
use App\Models\UserMedalRecord;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmojiConstestController extends Controller
{
    private $start_time = '2023-11-11 20:00:00';
    private $end_time = '2023-11-14 20:00:00';
    protected $chara_name_list = ['领结猫', '小甲鱼', '小蓝龙', '咖波', '谷歌布丁', '药水哥', 'Loopy', '粉红兔', '猫猫', '迷宫饭', 'Boocha', 'chiikawa', '线条小狗'];

    public function show(Request $request, $emoji_group_id)
    {
        $emoji_group_results = EmojiContest::where('emoji_group_id', $emoji_group_id)
            ->orderBy('votes_num_total', 'desc')
            ->orderBy('emoji_id', 'asc')
            ->get();

        // if (Carbon::now()->between(
        //     Carbon::parse($this->end_time),
        //     Carbon::parse($this->end_time)->addSeconds(-3600)
        // )) {
        //     $emoji_group_results = $emoji_group_results->get('emoji_id'); //最后一小时隐藏投票结果
        // } else {
        //     $emoji_group_results = $emoji_group_results->get();
        // }

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '查询成功！',
                'data' => $emoji_group_results
            ]
        );
    }

    public function show_user_votes(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
        ]);

        $user = $request->user;
        $user_vote_total = EmojiContestUserTotal::where('user_id', $user->id)
            ->orderBy('votes_num_total', 'desc')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '查询成功！',
                'data' => $user_vote_total
            ]
        );
    }

    public function user_vote(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'emoji_group_id' => 'required|integer',
            'emoji_id' => 'required|integer',
            'olo' => 'required|integer|min:100|max:1000000',
        ]);

        if (Carbon::now() < Carbon::parse($this->start_time)) {
            return response()->json([
                'code' => ResponseCode::DEFAULT,
                'message' => '本次表情包萌尚未开始哦',
            ]);
        }


        if (Carbon::now() > Carbon::parse($this->end_time)) {
            return response()->json([
                'code' => ResponseCode::DEFAULT,
                'message' => '嗷……本次表情包萌已经结束了',
            ]);
        }

        if ($request->olo % 100 != 0) {
            return response()->json([
                'code' => ResponseCode::DEFAULT,
                'message' => '投票olo数量必须是100的整数哦（100个olo为一票）',
            ]);
        } else {
            $votes_num = $request->olo / 100;
        }

        $user = $request->user;

        $emoji_contest = EmojiContest::where('emoji_id', $request->emoji_id)->first();
        if ($emoji_contest->emoji_group_id != $request->emoji_group_id) {
            return response()->json([
                'code' => ResponseCode::DEFAULT,
                'message' => 'emoji_group_id错误',
            ]);
        }

        try {
            DB::beginTransaction();

            $emoji_contest->increment('votes_num_total', $votes_num);
            $emoji_contest->save();

            EmojiContestUser::create([
                'user_id' => $user->id,
                'emoji_group_id' => $request->emoji_group_id,
                'emoji_id' => $request->emoji_id,
                'votes_num' => $votes_num,
            ]);

            $user_vote_total = EmojiContestUserTotal::where('user_id', $user->id)
                ->where('emoji_group_id', $request->emoji_group_id)
                ->first();

            if ($user_vote_total) {
                $user_vote_total->increment('votes_num_total', $votes_num);
                $user_vote_total->save();
            } else {
                $user_vote_total = EmojiContestUserTotal::create([
                    'user_id' => $user->id,
                    'emoji_group_id' => $request->emoji_group_id,
                    'votes_num_total' => $votes_num,
                ]);
            }

            $user->coinChange(
                'normal', //记录类型
                [
                    'olo' => -$request->olo,
                    'content' => sprintf('表情包萌投票：%s %d票', $this->chara_name_list[$request->emoji_group_id - 1], $votes_num),
                ]
            ); //（通过统一接口、记录操作）
            $user->save();

            //确认成就进度
            UserMedalRecord::check_emoji_contest_group(
                $request->emoji_group_id,
                $user_vote_total->votes_num_total,
                $user
            );
            UserMedalRecord::check_emoji_contest_total($user);

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '投票成功！',
            ]
        );
    }
}
