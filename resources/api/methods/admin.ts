import { commonAlova } from '@/api/index';


//管理员删除主题
interface deleteThreadParams {
    binggan: string,
    thread_id: number
    content: string
}
const deleteThreadPoster = (params: deleteThreadParams) => {
    const methodInstance = commonAlova.Post(
        'api/admin/thread_delete',
        params,
        {
            //第三个参数是config
            name: 'deleteThreadPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}


//管理员删除单个回复
interface deletePostParams {
    binggan: string,
    thread_id: number
    post_id: number,
    content: string,
    reduce_olo: boolean,
}
const deletePostPoster = (params: deletePostParams) => {
    const methodInstance = commonAlova.Delete(
        'api/admin/post_delete/' + params.post_id,
        params,
        {
            //第三个参数是config
            name: 'deletePostPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}

//管理员恢复已删除的单个回复
interface recoveryPostParams {
    binggan: string,
    thread_id: number
    post_id: number,
    content: string,
}
const recoveryPostPoster = (params: recoveryPostParams) => {
    const methodInstance = commonAlova.Put(
        'api/admin/post_recover/' + params.post_id,
        params,
        {
            //第三个参数是config
            name: 'recoveryPostPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}


//管理员删除某用户的全部回复
interface deleteAllPostParams {
    binggan: string,
    thread_id: number
    post_id: number,
    content: string,
    reduce_olo: boolean,
}
const deleteAllPostPoster = (params: deleteAllPostParams) => {
    const methodInstance = commonAlova.Post(
        'api/admin/post_delete_all',
        params,
        {
            //第三个参数是config
            name: 'deleteAllPostPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}

//管理员碎某用户的饼干
interface userBanParams {
    binggan: string,
    thread_id: number
    post_id: number,
    content: string,
}
const userBanPoster = (params: userBanParams) => {
    const methodInstance = commonAlova.Post(
        'api/admin/user_ban',
        params,
        {
            //第三个参数是config
            name: 'userBanPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}

//管理员临时封禁用户的饼干
interface userLockParams {
    binggan: string,
    thread_id: number
    post_id: number,
    content: string,
}
const userLockPoster = (params: userLockParams) => {
    const methodInstance = commonAlova.Post(
        'api/admin/user_lock',
        params,
        {
            //第三个参数是config
            name: 'userLockPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}


//管理员查询某用户的状态
interface userCheckParams {
    binggan: string,
    thread_id: number
    post_id: number,
}
const userCheckPoster = (params: userCheckParams) => {
    const methodInstance = commonAlova.Post<{ locked_count: string, user_status: string }>(
        'api/admin/check_post',
        params,
        {
            //第三个参数是config
            name: 'userCheckPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}

//管理员置顶一个主题
interface threadSetTopParams {
    binggan: string,
    thread_id: number
}
const threadSetTopPoster = (params: threadSetTopParams) => {
    const methodInstance = commonAlova.Post(
        'api/admin/thread_set_top',
        params,
        {
            //第三个参数是config
            name: 'threadSetTopPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}

//管理员取消置顶一个主题
interface threadCancelTopParams {
    binggan: string,
    thread_id: number
}
const threadCancelTopPoster = (params: threadCancelTopParams) => {
    const methodInstance = commonAlova.Post(
        'api/admin/thread_cancel_top',
        params,
        {
            //第三个参数是config
            name: 'threadCancelTopPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}

//管理员删除大喇叭
interface deleteLoudspeakerParams {
    binggan: string,
    loudspeaker_id: number
}
const deleteLoudspeakerPoster = (params: deleteLoudspeakerParams) => {
    const methodInstance = commonAlova.Post(
        'api/admin/del_loudspeaker',
        params,
        {
            //第三个参数是config
            name: 'deleteLoudspeakerPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}


export {
    deleteLoudspeakerParams, deleteLoudspeakerPoster, deleteThreadParams, deleteThreadPoster, deletePostParams, deletePostPoster,
    recoveryPostParams, recoveryPostPoster, deleteAllPostParams, deleteAllPostPoster, userBanParams, userBanPoster,
    userLockParams, userLockPoster, userCheckParams, userCheckPoster, threadSetTopParams, threadSetTopPoster,
    threadCancelTopParams, threadCancelTopPoster
}