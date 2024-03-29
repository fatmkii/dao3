import { commonAlova } from '@/api/index';
import type { subtitlesType } from '@/data/subtitles';
import type { threadType } from '@/vue/NewThread';
import type { postData } from '@/api/methods/posts';
import type { forumData } from '@/api/methods/forums';

interface threadData {
    id: number,
    sub_id: number,
    forum_id: number,
    vote_question_id: number | null,
    gamble_question_id: number | null,
    crowd_id: number | null,
    hongbao_id: number | null,
    nickname: string | null,
    title: string,
    sub_title: string,
    random_heads_group: number,
    posts_num: number,
    title_color: string | null,
    anti_jingfen: boolean,
    nissin_date: string | null,
    has_nissined: boolean,
    can_battle: boolean,
    is_delay: boolean,
    locked_by_coin: number,
    is_private: boolean,
    created_at: string | null,
    updated_at: string | null
    is_your_thread?: boolean,
}



interface newThreadParams {
    binggan: string,
    forumId: number,
    title: string,
    content: string,
    nickname: string,
    subtitle: subtitlesType,
    threadType: threadType,
    postWithAdmin: boolean,
    antiJingfen: boolean,
    isDelay: boolean,
    isPrivate: boolean,
    canBattle: boolean,
    randomHeadsGroup: number,
    nissinTime: number, //这是天数的数字
    titleColor: string | null,
    lockedByCoin: number | null,
    subId: number,

    hongbaoParams?: {
        type: number,
        hongbaoOlo: number,
        hongbaoNum: number,
        hongbaoKeyWord: string,
        hongbaoOloHide: boolean,
        hongbaoLoudspeaker: boolean,
    },

    voteParams?: {
        voteMultiple: boolean,
        voteTitle: string,
        voteOptions: string[],
        voteEndTime: string,
        voteMaxChoices: number
    },

    gambleParams?: {
        gambleTitle: string,
        gambleOptions: string[],
        gambleEndTime: string,
    }

    crowdParams?: {
        crowdTitle: string,
        crowdEndTime: string,
        crowdOloTarget: number,
    }
}
interface newThreadData {
    thread_id: number,
    forum_id: number
}
//发表新主题
const newThreadPoster = (params: newThreadParams) => commonAlova.Post<newThreadData>(
    '/api/threads/create',
    {
        //第二个参数是data
        binggan: params.binggan,
        forum_id: params.forumId,
        title: params.title,
        content: params.content,
        nickname: params.nickname,
        subtitle: params.subtitle,
        thread_type: params.threadType,
        post_with_admin: params.postWithAdmin,
        anti_jingfen: params.antiJingfen,
        is_delay: params.isDelay,
        is_private: params.isPrivate,
        can_battle: params.canBattle,
        random_heads_group: params.randomHeadsGroup,
        nissin_time: params.nissinTime, //这是天数的数字
        title_color: params.titleColor,
        locked_by_coin: params.lockedByCoin,
        sub_id: params.subId,

        ...(params.hongbaoParams === undefined ? {} :
            {
                hongbao_params: {
                    type: params.hongbaoParams.type,
                    hongbao_olo: params.hongbaoParams.hongbaoOlo,
                    hongbao_num: params.hongbaoParams.hongbaoNum,
                    hongbao_keyword: params.hongbaoParams.hongbaoKeyWord,
                    hongbao_olo_hide: params.hongbaoParams.hongbaoOloHide,
                    hongbao_loudspeaker: params.hongbaoParams.hongbaoLoudspeaker,
                }
            }),

        ...(params.voteParams === undefined ? {} :
            {
                vote_params: {
                    vote_multiple: params.voteParams.voteMultiple,
                    vote_title: params.voteParams.voteTitle,
                    vote_options: params.voteParams.voteOptions,
                    vote_end_time: params.voteParams.voteEndTime,
                    vote_max_choices: params.voteParams.voteMaxChoices
                }
            }),

        ...(params.gambleParams === undefined ? {} :
            {
                gamble_params: {
                    gamble_title: params.gambleParams.gambleTitle,
                    gamble_options: params.gambleParams.gambleOptions,
                    gamble_end_time: params.gambleParams.gambleEndTime,
                }
            }),

        ...(params.crowdParams === undefined ? {} :
            {
                crowd_params: {
                    crowd_title: params.crowdParams.crowdTitle,
                    crowd_end_time: params.crowdParams.crowdEndTime,
                    crowd_olo_target: params.crowdParams.crowdOloTarget,
                }
            }),

    },
    {
        name: 'newThreadPoster',
        localCache: null,
    }
)

//撤回延时主题
const delayThreadDeleter = (threadId: number) => {
    const methodInstance = commonAlova.Delete(
        '/api/threads/delay/' + threadId,
        {
            name: 'delayThreadDeleter',
            localCache: null,
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    }
    return methodInstance
}

//获取主题内的回复清单
interface postsListData {
    forum_data: forumData,
    thread_data: threadData,
    posts_data: {
        currentPage: number,
        lastPage: number,
        data: postData[],
    },
    your_post_floors: number[],
}
interface getPostsListParams {
    threadId: number,
    binggan: string,
    page: number,
    searchContent?: string,
}

const postsListGetter = (params: getPostsListParams) => commonAlova.Get<postsListData>(
    '/api/threads/' + params.threadId,
    {
        name: 'postsListGetter',
        params: {
            binggan: params.binggan,
            page: params.page,
            search_content: params.searchContent,
        },
        localCache: null,
    }
)

//标题改色
interface threadChangeColorParams {
    binggan: string,
    thread_id: number,
    color: string,
}
const threadChangeColorPoster = (params: threadChangeColorParams) => {
    const methodInstance = commonAlova.Post(
        'api/threads/change_color',
        params,
        {
            //第三个参数是config
            name: 'threadChangeColorPoster',
            params: {},
            localCache: null,
            hitSource: [],
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}


export {
    threadData, delayThreadDeleter, newThreadPoster, newThreadParams, postsListGetter, postsListData, getPostsListParams,
    threadChangeColorParams, threadChangeColorPoster,
}