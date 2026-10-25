<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThreadFirstPostRevision extends Model
{
    public const EDIT_COST = 300;

    public $timestamps = false;

    protected $guarded = ['id'];

    protected $casts = ['version' => 'integer', 'version_at' => 'datetime'];

    public static function canEdit(Thread $thread, ?Post $post, ?User $user): bool
    {
        return $user && $post && $thread->is_deleted == 0 && $post->is_deleted == 0
            && $thread->created_binggan === $user->binggan && $post->created_binggan === $user->binggan;
    }

    public static function canViewHistory(Thread $thread, ?Post $post, ?User $user): bool
    {
        if (! $post) {
            return false;
        }

        return $post->is_deleted == 0 || ($user && ($post->created_binggan === $user->binggan
            || ($user->tokenCan('forum_admin') && in_array($thread->forum_id, $user->AdminPermissions?->forums ?? []))));
    }

    public function publicData(int $currentVersion): array
    {
        return [
            'version' => $this->version,
            'content' => $this->content,
            'version_at' => $this->version_at->format('Y-m-d H:i:s'),
            'is_current' => $this->version === $currentVersion,
        ];
    }
}
