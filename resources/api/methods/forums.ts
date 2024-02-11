import { commonAlova, } from '@/api/index';
import type { threadData } from '@/api/methods/threads';

interface forumData<arrayType> {
    "id": number,
    "sub_id": number,
    "name": string,
    "description": string,
    "status": number,
    "is_anonymous": number,
    "accessible_coin": number,
    "is_nissin": number,
    "banners": arrayType,
    "default_heads": number,
    "deleted_at": string | null
}

//获取所有板块信息列表
const forumsDataGetter = commonAlova.Get(
    '/api/forums/',
    {
        name: 'forumsDataGetter',
        params: {},
        localCache: 60 * 60 * 1000,
        transformData(data: forumData<string>[], headers) {
            return data.map(item => ({
                ...item,
                banners: JSON.parse(item.banners) as string[]
            }));
        }
    }

)

interface threadsListData<arrayType> {
    forum_data: forumData<arrayType>,
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
const threadsListGetter = (params: getThreadsListParams) => commonAlova.Get(
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
        transformData(data: threadsListData<string>, headers) {
            const result = {
                ...data,
                forum_data: {
                    ...data.forum_data,
                    banners: JSON.parse(data.forum_data.banners) as string[]
                    // 通过...展开操作的result是data的另一份拷贝，并且banners会正确地推断出类型
                    //（正确应为string[],如果只是给对象的属性赋值会认为仍然是string），总之我服了！
                }
            }
            return result;
        }
    }
)


export { forumsDataGetter, forumData, threadsListData, getThreadsListParams, threadsListGetter }