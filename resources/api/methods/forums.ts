import { commonAlova, } from '@/api/index';
import type { threadData } from '@/api/methods/threads';

interface forumData {
    "id": number,
    "sub_id": number,
    "name": string,
    "description": string,
    "status": number,
    "is_anonymous": number,
    "accessible_coin": number,
    "is_nissin": number,
    "banners": string[],
    "default_heads": number,
    "deleted_at": string | null
}

//获取所有板块信息列表
const forumsDataGetter = commonAlova.Get<forumData[]>(
    '/api/forums/',
    {
        name: 'forumsDataGetter',
        params: {},
        localCache: 60 * 60 * 1000,
    }

)

interface threadsListData {
    forum_data: forumData,
    threads_data: {
        currentPage: number,
        lastPage: number,
        data: threadData[],
    },
    subtitles_exclude: string | null,
}

interface getThreadsListParams {
    forumId: number,
    binggan: string | null,
    page: number | null,
    threadsPerPage: number | null,
    subtitlesExcluded: string[],
    searchTitle?: string
    delay?: boolean
}

//获取版面中的主题列表
const threadsListGetter = (params: getThreadsListParams) => commonAlova.Get<threadsListData>(
    '/api/forums/' + params.forumId,
    {
        name: 'threadsListGetter',
        params: {
            binggan: params.binggan,
            page: params.page,
            threads_per_page: params.threadsPerPage,
            subtitles_excluded: JSON.stringify(params.subtitlesExcluded),
            search_title: params.searchTitle,
            delay: params.delay ? 1 : 0
        },
        localCache: null,
    }
)


export { forumsDataGetter, forumData, threadsListData, getThreadsListParams, threadsListGetter }