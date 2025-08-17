import { commonAlova } from '@/api/index';

//红包数据（被包含在postData内）
interface hongbaoPostData {
    id: number,
    floor: number,
    num_total: number,
    olo_total?: number,//当olo_hide = true时，olo_total会被隐藏
    num_remains: number,
    type: 1 | 2, //1=随机红包, 2=定额红包
    key_word_type: 1 | 2 | 3,//1=普通口令红包, 2=抢答红包(答案不显示、回复显示), 3=暗号红包(答案回复都不显示)
    olo_hide: number,
    key_word?: string, //当key_word_type是2|3时，key_word会被隐藏
    question: string,
    hongbao_user: {
        olo: number,
        floor: number
    } | null
    pic_url: string | null,
}

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
    // battle_data: battleData | null,  //3.0开始battle数据改为单独api请求
    hongbao_data: hongbaoPostData | null
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

//获取单个回复数据
interface postParams {
    binggan: string,
    thread_id: number,
    post_id: number,
}
const postGetter = (params: postParams) => {
    const methodInstance = commonAlova.Get<postData>(
        'api/posts/' + params.post_id,
        {
            //第三个参数是config
            name: 'postGetter',
            params: {
                binggan: params.binggan,
                thread_id: params.thread_id,
            },
            localCache: null,
            hitSource: [],
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}


//用户删除回复
interface deletePostParams {
    binggan: string,
    thread_id: number,
    post_id: number,
}
const deletePostDeleter = (params: deletePostParams) => {
    const methodInstance = commonAlova.Delete(
        'api/posts/' + params.post_id,
        {
            binggan: params.binggan,
            thread_id: params.thread_id,
        },
        {
            //第三个参数是config
            name: 'deletePostDeleter',
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

//用户恢复已删除的回复
interface recoverPostParams {
    binggan: string,
    thread_id: number,
    post_id: number,
}
const recoverPostPutter = (params: recoverPostParams) => {
    const methodInstance = commonAlova.Put(
        'api/posts/recover/' + params.post_id,
        {
            binggan: params.binggan,
            thread_id: params.thread_id,
        },
        {
            //第三个参数是config
            name: 'recoverPostPutter',
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

//Roll点功能
interface rollPostParams {
    binggan: string,
    thread_id: number,
    forum_id: number,
    roll_name?: string,
    roll_event?: string,
    roll_num: number,
    roll_range: number
}
const rollPostPoster = (params: rollPostParams) => {
    const methodInstance = commonAlova.Post(
        'api/posts/create_roll',
        params,
        {
            //第三个参数是config
            name: 'rollPostPoster',
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

export { postData, hongbaoPostData, newPostPoster, newPostParams, deletePostDeleter, deletePostParams, recoverPostPutter, recoverPostParams, postGetter, postParams, rollPostPoster, rollPostParams }