<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Thread;
use App\Models\Forum;
use App\Models\Post;
use App\Common\ResponseCode;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use App\Events\NewPostBroadcast;
use App\Exceptions\CoinException;
use App\Facades\GlobalSetting;
use App\Models\HongbaoPost;
use App\Models\HongbaoPostUser;
use App\Models\User;
use App\Models\UserMedalRecord;
use Exception;
use Illuminate\Support\Facades\Redis;

class HongbaoPostController extends Controller
{
    public function create(Request $request)
    {
        // if (Carbon::now()->between('2022/12/6 08:00:00', '2022/12/7 00:00:00')) {
        //     return response()->json([
        //         'code' => ResponseCode::DEFAULT,
        //         'message' => '今天8:00到24:00暂停大乱斗和红包。T_T',
        //     ]);
        // }

        $request->validate([
            'recording_id' => 'prohibited',
            'binggan' => 'required|string',
            'forum_id' => 'required|integer',
            'thread_id' => 'required|integer',
            //红包相关验证
            'hongbao_olo' => 'required|integer|min:3000|max:1000000',
            'hongbao_num' => 'required|integer|min:5|max:50',
            'type' => 'required|integer',
            'key_word_type' => 'nullable|integer',
            'hongbao_key_word' => 'required|string|max:255',
            'hongbao_question' => 'nullable|string|max:255',
            // 'hongbao_message' => 'nullable|string|max:255',//3.0代码直接使用下面的hongbao_message_json
            'hongbao_message_json' => 'nullable|array|max:10',
            'hongbao_olo_hide' => 'nullable|boolean',
            'pic_url' => 'nullable|string|max:255',
        ]);

        $user = $request->user();


        $thread = Thread::find($request->thread_id);
        if (!$thread || $thread->is_delay == 1 || $thread->is_deleted != 0) {
            return response()->json([
                'code' => ResponseCode::THREAD_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::THREAD_NOT_FOUND],
            ]);
        }

        $forum = Forum::find($request->forum_id);
        if (!$forum) {
            return response()->json([
                'code' => ResponseCode::FORUM_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::FORUM_NOT_FOUND],
            ]);
        }

        //判断是否达到可以访问板块的最少奥利奥
        if ($forum->accessible_coin > 0) {
            if ($user->getCoin() < $forum->accessible_coin && !(in_array($user->admin, [99, 20, 10]))) {
                return response()->json([
                    'code' => ResponseCode::THREAD_UNAUTHORIZED,
                    'message' => sprintf("本小岛需要拥有大于%u奥利奥才能查看喔", $forum->accessible_coin),
                ]);
            }
        }

        //判断奥利奥锁定权限贴
        if ($thread->locked_by_coin > 0) {
            if ($user->getCoin() < $thread->locked_by_coin && !(in_array($user->admin, [99, 20, 10]))) {
                return response()->json([
                    'code' => ResponseCode::THREAD_UNAUTHORIZED,
                    'message' => sprintf("本贴需要拥有大于%u奥利奥才能查看喔", $thread->locked_by_coin),
                ]);
            }
        }

        //判断是否私密主题 
        if ($thread->is_private == true) {
            if ($user->binggan != $thread->created_binggan && $user->admin != 99) {
                return response()->json([
                    'code' => ResponseCode::THREAD_IS_PRIVATE,
                    'message' => '本贴是私密主题，只有发帖者可以查看喔',
                ]);
            }
        }

        //执行追加新回复流程
        try {

            DB::beginTransaction();

            $post = Post::create([
                'created_binggan' => $user->binggan,
                'forum_id' => $request->forum_id,
                'thread_id' => $request->thread_id,
                'content' => "来抢红包啦！",
                'nickname' => '红包系统',
                'created_by_admin' => 2,
                'created_IP' => $request->ip(),
            ]);

            $tax_rate = GlobalSetting::get_tax('hongbao', null, $request->hongbao_num);
            $coin_pay = ceil($request->hongbao_olo * $tax_rate);
            $user->coinChange(
                'normal', //记录类型
                [
                    'olo' => -$coin_pay,
                    'content' => '发起口令红包',
                    'thread_id' => $request->thread_id,
                    'post_id' => $post->id,
                    'floor' => $post->floor,
                    'thread_title' => $request->title,
                    'type' => 'hongbao_out',
                ]
            ); //扣除用户相应olo（通过统一接口、记录操作）

            //追加红包贴
            $hongbao = HongbaoPost::create([
                'user_id' => $user->id,
                'thread_id' => $request->thread_id,
                'post_id' => $post->id,
                'floor' => $post->floor,
                'olo_total' => $request->hongbao_olo,
                'num_total' => $request->hongbao_num,
                'olo_remains' => $request->hongbao_olo,
                'num_remains' => $request->hongbao_num,
                'type' => $request->type,
                'key_word_type' => $request->key_word_type,
                'key_word' => $request->hongbao_key_word,
                'message' => $request->hongbao_message,
                'message_json' => $request->hongbao_message_json,
                'question' => $request->hongbao_question,
                'olo_hide' => $request->hongbao_olo_hide,
                'pic_url' => $request->pic_url,
            ]);

            //将hongbao->id返回给post表记录
            $post->hongbao_id = $hongbao->id;
            $post->save();


            //检查红包成就
            $user_medal_record = $user->UserMedalRecord()->firstOrCreate();
            $user_medal_record->push_hongbao_out($request->hongbao_olo);

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        //广播发帖动作
        // $post->broadcast();

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已发出新红包！',
            ],
        );
    }


    public function store(Request $request)
    {
        $request->validate([
            'recording_id' => 'prohibited',
            //一般回复的验证
            'binggan' => 'required|string',
            'forum_id' => 'required|integer',
            'thread_id' => 'required|integer',
            'content' => 'required|string|max:20000',
            'nickname' => 'max:30',
            'post_with_admin' => 'boolean',

            //抢红包的验证
            'hongbao_post_id' => 'required|integer',
            'hongbao_key_word' => 'required|string'
        ]);


        $user = $request->user();

        $thread = Thread::find($request->thread_id);
        if (!$thread || $thread->is_delay == 1 || $thread->is_deleted != 0) {
            return response()->json([
                'code' => ResponseCode::THREAD_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::THREAD_NOT_FOUND],
            ]);
        }

        $forum = Forum::find($request->forum_id);
        if (!$forum) {
            return response()->json([
                'code' => ResponseCode::FORUM_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::FORUM_NOT_FOUND],
            ]);
        }


        //判断是否达到可以访问板块的最少奥利奥
        if ($forum->accessible_coin > 0) {
            if ($user->getCoin() < $forum->accessible_coin && !(in_array($user->admin, [99, 20, 10]))) {
                return response()->json([
                    'code' => ResponseCode::THREAD_UNAUTHORIZED,
                    'message' => sprintf("本小岛需要拥有大于%u奥利奥才能查看喔", $forum->accessible_coin),
                ]);
            }
        }

        //判断奥利奥锁定权限贴
        if ($thread->locked_by_coin > 0) {
            if ($user->getCoin() < $thread->locked_by_coin && !(in_array($user->admin, [99, 20, 10]))) {
                return response()->json([
                    'code' => ResponseCode::THREAD_UNAUTHORIZED,
                    'message' => sprintf("本贴需要拥有大于%u奥利奥才能查看喔", $thread->locked_by_coin),
                ]);
            }
        }


        $hongbao = $request->attributes->has('hongbao_post')
            ? $request->attributes->get('hongbao_post')
            : HongbaoPost::find($request->hongbao_post_id);
        if (!$hongbao) {
            return $this->claimError(ResponseCode::HONGBAO_NOT_FOUND);
        }

        $key = sprintf('hongbao_post_%s_%s', $hongbao->id, $request->ip());
        if ($hongbao->key_word != $request->hongbao_key_word) {
            $this->assertClaimAvailable($hongbao, $user);
            if (Redis::exists($key)) {
                return $this->claimError(ResponseCode::HONGBAO_TOO_MANY);
            }

            $post = DB::transaction(fn () => $this->createClaimReply($request, $user, $request->content));
            UserMedalRecord::check_floor($post->floor, $user);
            $user->UserMedalRecord()->firstOrCreate()->push_posts_num();

            return $this->claimError(ResponseCode::HONGBAO_KEYWORD_WRONG);
        }

        [$post, $packetFloor, $coin] = DB::transaction(function () use ($request, $user, $thread, $hongbao, $key) {
            // 领取者先锁定同一红包，再用最新库存和领取记录决定是否写入。
            $packet = HongbaoPost::withTrashed()->lockForUpdate()->find($hongbao->id);
            if (!$packet || ($packet->trashed() && $packet->num_remains > 0)) {
                throw new HttpResponseException($this->claimError(ResponseCode::HONGBAO_NOT_FOUND));
            }
            $this->assertClaimAvailable($packet, $user);
            if (!Redis::set($key, 1, 'EX', 10, 'NX')) {
                throw new HttpResponseException($this->claimError(ResponseCode::HONGBAO_TOO_MANY));
            }

            $isLast = $packet->num_remains == 1;
            $coin = 0;
            if ($isLast) {
                $coin = $packet->olo_remains;
            } elseif ($packet->type == 1) {
                $central = intval($packet->olo_remains / $packet->num_remains);
                $coin = rand(0, $central * 2);
            } elseif ($packet->type == 2) {
                $coin = intval($packet->olo_total / $packet->num_total);
            }

            $content = $packet->key_word_type == 3
                ? '--红包口令: （暗号红包已隐藏口令）'
                : $request->content;
            $post = $this->createClaimReply($request, $user, $content);
            $result = $isLast
                ? sprintf('恭喜抢到来自№%d楼的最后一个红包，有%d个奥利奥！', $packet->floor, $coin)
                : sprintf('你抢到了来自№%d楼的%d个奥利奥！', $packet->floor, $coin);
            $result = '@№'.$post->floor.'：'.$result;

            $message = '';
            if ($packet->message) {
                $message = $packet->message;
                $result .= '<br>——'.$message;
            }
            $messages = $packet->message_json;
            if ($messages) {
                $message = $messages[array_rand($messages)];
                $result .= '<br>——'.$message;
            }

            $packet->olo_remains -= $coin;
            $packet->num_remains--;
            if ($isLast) {
                $packet->deleted_at = now();
            }
            $packet->save();

            Post::create([
                'created_binggan' => $user->binggan,
                'forum_id' => $request->forum_id,
                'thread_id' => $request->thread_id,
                'content' => $result,
                'nickname' => '红包结果',
                'created_by_admin' => 2,
                'created_IP' => $request->ip(),
            ]);

            $user->coinChange('normal', [
                'olo' => $coin,
                'content' => $message != '' ? '抢到红包——'.$message : '抢到红包',
                'thread_id' => $thread->id,
                'thread_title' => $thread->title,
                'post_id' => $post->id,
                'floor' => $post->floor,
                'type' => 'hongbao_in',
            ]);
            HongbaoPostUser::create([
                'hongbao_post_id' => $packet->id,
                'user_id' => $user->id,
                'olo' => $coin,
                'floor' => $post->floor,
                'created_at' => now(),
            ]);

            return [$post, $packet->floor, $coin];
        });

        UserMedalRecord::check_floor($post->floor, $user);
        $userMedalRecord = $user->UserMedalRecord()->firstOrCreate();
        $userMedalRecord->push_hongbao_in($coin);
        $userMedalRecord->push_posts_num();

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => sprintf('你抢到了来自№%d楼的%d个奥利奥！', $packetFloor, $coin),
            'data' => null,
        ]);
    }

    private function assertClaimAvailable(HongbaoPost $packet, User $user): void
    {
        if (HongbaoPostUser::where('hongbao_post_id', $packet->id)->where('user_id', $user->id)->exists()) {
            throw new HttpResponseException($this->claimError(ResponseCode::HONGBAO_HAS_BEEN_USED));
        }

        if ($packet->num_remains == 0) {
            throw new HttpResponseException($this->claimError(ResponseCode::HONGBAO_HAS_BEEN_CLOSED));
        }
    }

    private function createClaimReply(Request $request, User $user, string $content): Post
    {
        $post = Post::create([
            'created_binggan' => $user->binggan,
            'forum_id' => $request->forum_id,
            'thread_id' => $request->thread_id,
            'content' => $content,
            'nickname' => $request->nickname,
            'created_by_admin' => $request->post_with_admin ? 1 : 0,
            'created_IP' => $request->ip(),
        ]);
        $user->coinChange('post', ['olo' => 10, 'content' => '回帖', 'type' => 'post']);

        return $post;
    }

    private function claimError(int $code): JsonResponse
    {
        return response()->json(['code' => $code, 'message' => ResponseCode::$codeMap[$code]]);
    }
}
