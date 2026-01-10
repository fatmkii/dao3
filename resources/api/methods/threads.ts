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
    forum_id: number,
    title: string,
    content: string,
    nickname: string,
    subtitle: subtitlesType,
    thread_type: threadType,
    post_with_admin: boolean,
    anti_jingfen: boolean,
    is_delay: boolean,
    is_private: boolean,
    can_battle: boolean,
    random_heads_group: number,
    nissin_time: number, //这是天数的数字
    title_color: string | null,
    locked_by_coin: number | null,
    sub_id: number,

    hongbao_params?: {
        olo: number,
        num: number,
        type: number,
        keyword: string,
        message: string[],
        olo_hide: boolean,
        loudspeaker: boolean,
        pic_url: string | null,
    },

    vote_params?: {
        multiple: boolean,
        title: string,
        options: string[],
        end_time: string,
        max_choices: number
    },

    gamble_params?: {
        title: string,
        options: string[],
        end_time: string,
    }

    crowd_params?: {
        title: string,
        end_time: string,
        olo_target: number,
    }
}
interface newThreadData {
    thread_id: number,
    forum_id: number
}
//发表新主题
const newThreadPoster = (params: newThreadParams) => commonAlova.Post<newThreadData>(
    '/api/threads/create',
    params,
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
    watermark_string: string,
}
interface getPostsListParams {
    threadId: number,
    binggan: string,
    page: number,
    searchContent?: string,
    noMentionMode?: boolean,
}

const postsListGetter = (params: getPostsListParams) => commonAlova.Get<postsListData>(
    '/api/threads/' + params.threadId,
    {
        name: 'postsListGetter',
        params: {
            binggan: params.binggan,
            page: params.page,
            search_content: params.searchContent,
            mention: !params.noMentionMode ? 1 : 0,
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