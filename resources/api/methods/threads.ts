import { commonAlova } from '@/api/index';
import { forumData } from '@/api/methods/forums'

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

interface threadsListData {
    forum_data: forumData,
    threads_data: {
        currentPage: number,
        lastPage: number,
        data: threadData[],
    },
    subtitles_exclude: string | null,
}

interface getThreadsDataParams {
    forumId: number,
    binggan: string | null,
    page: number | null,
    threadsPerPage: number | null,
    subtitlesExcluded: string[],
    searchTitle: string
}

const threadsDataGetter = (params: getThreadsDataParams) => commonAlova.Get<threadsListData>(
    '/api/forums/' + params.forumId,
    {
        name: 'threadsDataGetter',
        params: {
            binggan: params.binggan,
            page: params.page,
            threads_per_page: params.threadsPerPage,
            subtitles_excluded: params.subtitlesExcluded,
            searchTitle: params.searchTitle
        },
        localCache: null
    }
)



export { threadsDataGetter, threadsListData, getThreadsDataParams }