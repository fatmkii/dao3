<?php

namespace App\Services;

use App\Exceptions\CustomAccountExistsException;
use App\Jobs\ProcessUserActive;
use App\Jobs\ProcessUserCreatedLocation;
use App\Models\User;
use App\Models\UserBank;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CustomAccountService
{
    public function __construct(private readonly MobileSessionService $sessions)
    {
    }

    public function create(
        User $origin,
        string $binggan,
        string $password,
        bool $transfer,
        string $ip,
    ): User {
        if (User::where('binggan', $binggan)->exists()) {
            throw new CustomAccountExistsException;
        }

        $created = DB::transaction(function () use ($origin, $binggan, $password, $transfer, $ip) {
            $new = new User;
            $new->binggan = $binggan;
            $new->created_ip = $ip;
            $new->is_custom = true;
            $new->coin = 300;
            $new->password = hash('sha256', $password.config('app.password_salt'));
            $new->save();

            $origin->coinChange('normal', [
                'olo' => -100000,
                'content' => '申请了定制饼干',
                'type' => 'default_out',
            ]);
            $origin->save();

            DB::table('user_custom')->insert([
                'user_id' => $new->id,
                'binggan' => $new->binggan,
                'from_binggan' => $origin->binggan,
                'is_transfered' => $transfer,
                'created_at' => Carbon::now(),
            ]);

            if ($transfer) {
                $this->transfer($origin, $new);
                $this->sessions->revokeAllForUser($origin);
            }

            return $new;
        });

        $origin->UserMedalRecord()->firstOrCreate()->check_custom_binggan();
        ProcessUserCreatedLocation::dispatch(['IP' => $ip, 'user_id' => $created->id]);
        ProcessUserActive::dispatch([
            'binggan' => $origin->binggan,
            'user_id' => $origin->id,
            'active' => '用户新建了定制饼干',
            'binggan_target' => $created->binggan,
            'content' => $transfer ? '并且转移了饼干，原饼干已碎。' : '没有转移饼干',
        ]);
        ProcessUserActive::dispatch([
            'binggan' => $created->binggan,
            'user_id' => $created->id,
            'active' => '新建的定制饼干',
            'content' => $transfer ? '并且转移了饼干，原饼干已碎。' : '没有转移饼干',
        ]);

        return $created;
    }

    private function transfer(User $origin, User $new): void
    {
        $new->nickname = $origin->nickname;
        $new->locked_until = $origin->locked_until;
        $new->locked_count = $origin->locked_count;
        $new->coin_in_bank = $origin->coin_in_bank;
        $new->last_login = $origin->last_login;
        $new->use_pingbici = $origin->use_pingbici;
        $new->new_msg = $origin->new_msg;
        $new->user_lv = $origin->user_lv;
        $new->save();

        $new->coinChange('normal', [
            'olo' => $origin->coin,
            'content' => '从旧饼干转移过来',
            'type' => 'default_in',
        ]);
        $new->save();

        $userLevel = $origin->UserLV;
        if ($userLevel) {
            $userLevel->replicate()->fill(['user_id' => $new->id])->save();
        }

        $emoji = $origin->MyEmoji;
        if ($emoji) {
            $emoji->replicate()->fill(['user_id' => $new->id])->save();
        }

        foreach ($origin->MyBattleChara ?? [] as $character) {
            $character->replicate()->fill(['user_id' => $new->id])->save();
        }

        foreach ($origin->UserBank()->where('is_deleted', false)->get() as $bank) {
            $bank->replicate()->fill(['user_id' => $new->id])->save();
            $bank->is_deleted = true;
            $bank->save();
        }
        $origin->coin_in_bank = UserBank::where('user_id', $origin->id)
            ->where('is_deleted', false)
            ->sum('olo');
        $origin->save();

        foreach ($origin->UserMedal ?? [] as $medal) {
            $medal->replicate()->fill([
                'user_id' => $new->id,
                'created_at' => $medal->created_at,
            ])->save();
        }

        $medalRecord = $origin->UserMedalRecord;
        if ($medalRecord) {
            $medalRecord->replicate()->fill(['user_id' => $new->id])->save();
        }

        $blockedWords = $origin->Pingbici;
        if ($blockedWords) {
            $blockedWords->replicate()->fill(['user_id' => $new->id])->save();
        }

        $origin->is_banned = true;
        $origin->save();
    }
}
