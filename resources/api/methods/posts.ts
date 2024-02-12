import { commonAlova } from '@/api/index';
import { forumData } from '@/api/methods/forums'
import type { subtitlesType } from '@/data/subtitles';
import type { threadType } from '@/vue/NewThread';

interface postData {
    id: number,
    created_at: string,
    is_deleted: number,//0=正常；1=被用户删除；2=被管理员删除
    thread_id: number,
    battle_id: number | null,
    hongbao_id: number | null,
    floor: number,
    random_head: number,
    created_by_admin: number, //0=一般用户 1=管理员发布，2=系统发布
    content: string,
    nickname: string,
    is_your_post: boolean,
    battle_data: object | null,
    hongbao_data: object | null
    created_binggan?: string,
    created_binggan_hash?: string,
}

//发新帖
interface newPostParams {
    binggan: string,
    forum_id: number,
    thread_id: number,
    content: string,
    nickname: string,
    post_with_admin: boolean,
    new_post_key: string,
    timestamp: number,
}
const newPostPoster = (params: newPostParams) => {
    const methodInstance = commonAlova.Post(
        'api/posts/create',
        params,
        {
            //第三个参数是config
            name: 'newPostPoster',
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



export { postData, newPostPoster, newPostParams, }