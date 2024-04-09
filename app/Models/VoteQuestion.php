<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\VoteUser;
use Illuminate\Http\Request;
use Carbon\Carbon;

class VoteQuestion extends Model
{
    use HasFactory;

    protected $guarded = [];

    public $hidden = [
        'thread_id',
        'created_at',
        'updated_at',
        'VoteOption',
    ];

    protected $cast = [
        'multiple' => 'boolean',
    ];

    public function VoteOption()
    {
        return $this->hasMany(VoteOption::class);
    }

    public function VoteUserChoices($user_id)
    {
        return VoteUser::suffix(intval($this->id / 10000))->where('vote_question_id', $this->id)
            ->where('user_id', $user_id)->first();
    }

    public function Thread()
    {
        return $this->belongsTo(Thread::class);
    }

    protected function serializeDate($date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public static function create(Request $request, $thread_id)
    {
        $request->validate([
            'vote_params.title' => 'required|string|max:100',
            'vote_params.end_time' => 'required|date_format:Y-m-d H:i:s|before:' . Carbon::now()->addMonth(1), //投票时长最多一个月
            'vote_params.options' => 'array|required',
            'vote_params.max_choices' => 'integer|required',
            'vote_params.multiple' => 'boolean|required'
        ]);

        // $request_options = json_decode($request->vote_params['vote_options'], true); //前端提交的已经是array了

        $vote_question = new VoteQuestion();
        $vote_question->thread_id = $thread_id;
        $vote_question->title = $request->vote_params['title'];
        $vote_question->end_date = Carbon::parse($request->vote_params['end_time']);
        $vote_question->multiple = $request->vote_params['multiple'];
        $vote_question->max_choices = $request->vote_params['max_choices'];
        $vote_question->save();

        foreach ($request->vote_params['options'] as $request_option) {
            $options = new VoteOption;
            $options->vote_question_id = $vote_question->id;
            $options->option_text = $request_option;
            $options->save();
        }

        return $vote_question;
    }
}
