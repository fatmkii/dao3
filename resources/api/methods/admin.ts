import { commonAlova } from '@/api/index';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()

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

//管理员设置版头
interface setBannersParams {
    binggan: string,
    forum_id: number,
    banners: string[]
}
const setBannersPoster = (params: setBannersParams) => {
    const methodInstance = commonAlova.Post(
        'api/admin/set_banner',
        params,
        {
            //第三个参数是config
            name: 'setBannersPoster',
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

//管理员发放成就徽章
interface createMedalParams {
    binggan: string,
    binggan_target: string,
    medal_id: number,
}
const createMedalPoster = (params: createMedalParams) => {
    const methodInstance = commonAlova.Post(
        'api/admin/create_medal',
        params,
        {
            //第三个参数是config
            name: 'createMedalPoster',
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

//管理员奖罚olo
interface setUserOloParams {
    binggan: string,
    binggan_target: string,
    olo_num: number,
    olo_message: string,
}
const setUserOloPoster = (params: setUserOloParams) => {
    const methodInstance = commonAlova.Post(
        'api/admin/set_user_olo',
        params,
        {
            //第三个参数是config
            name: 'setUserOloPoster',
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

//获取全局变量数据
interface globalSettingData {
    new_binggan: boolean,
    new_loudspeaker: boolean,
    home_banners: string[]
}
const globalSettingDataGetter = (key: string = '') => {
    const methodInstance = commonAlova.Get<globalSettingData>(
        'api/admin/global_setting/' + key,
        {
            name: 'globalSettingDataGetter',
            params: {
                binggan: userStore.binggan
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

//管理员设定全局变量
interface setGlobalSettingParams {
    binggan: string,
    key: string,
    value: any
}
const setGlobalSettingPoster = (params: setGlobalSettingParams) => {
    const methodInstance = commonAlova.Post(
        'api/admin/set_global_setting',
        params,
        {
            //第三个参数是config
            name: 'setGlobalSettingPoster',
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

//查询管理员操作清单
interface adminActivesData {
    name: string,
    admin_level: number,
    active: string,
    active_type: string,
    content: string,
    olo: number,
    post_id: number,
    thread_id: number,
    thread_title: number,
    floor: number,
    is_rollbacked: boolean,
    created_at: string,
    updated_at: string,
    post_content: string,
}
interface adminActivesListData {
    data: adminActivesData[],
    last_page: number,
}
interface adminActivesGetterParams {
    binggan: string,
    page: number | null,
    date: string | null,
}
const adminActivesGetter = (params: adminActivesGetterParams) => {
    const methodInstance = commonAlova.Get<adminActivesListData>(
        'api/admin/actives',
        {
            name: 'adminActivesGetter',
            params: params,
            localCache: null,
            hitSource: [],
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}

//超级管理员解锁uuid
interface unlockUuidParams {
    binggan: string,
    uuid: string,
}
const unlockUuidPoster = (params: unlockUuidParams) => {
    const methodInstance = commonAlova.Post(
        'api/admin/unlock_uuid',
        params,
        {
            //第三个参数是config
            name: 'unlockUuidPoster',
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
    threadCancelTopParams, threadCancelTopPoster,
    setBannersParams, setBannersPoster, createMedalParams, createMedalPoster, setUserOloParams, setUserOloPoster,
    globalSettingData, globalSettingDataGetter, setGlobalSettingParams, setGlobalSettingPoster,
    adminActivesData, adminActivesGetter, adminActivesGetterParams, unlockUuidParams, unlockUuidPoster,
}