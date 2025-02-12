import { commonAlova } from '@/api/index';


//获取大喇叭数据
interface loudspeakerData {
    id: number,
    sub_id: number,
    content: string,
    color: string | null,
    thread_id: number | null,
    effective_date: string,
    expire_date: string,
    created_at: string,
    is_your_loudspeaker: boolean
}
interface loudspeakerDataParams {
    binggan: string,
    mode: 'all' | 'effective'
}
const loudspeakerDataGetter = (params: loudspeakerDataParams) => {
    const methodInstance = commonAlova.Get<loudspeakerData[]>(
        'api/loudspeaker/show',
        {
            //第二个参数是config
            name: 'loudspeakerDataGetter',
            params: params,
            // localCache: { mode: 'restore', expire: 60 * 1000 },
            // hitSource: ['newLoudspeakerPoster', 'repealLoudspeakerPoster', 'deleteLoudspeakerPoster']
            localCache: null,
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}

//发送大喇叭
interface newLoudspeakerParams {
    binggan: string,
    sub_id: string,
    content: string,
    color?: string,
    thread_id?: string,
    effective_date: string,
    days: number,
}
const newLoudspeakerPoster = (params: newLoudspeakerParams) => {
    const methodInstance = commonAlova.Post(
        'api/loudspeaker/create',
        params,
        {
            //第三个参数是config
            name: 'newLoudspeakerPoster',
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

//撤回大喇叭
interface repealLoudspeakerParams {
    binggan: string,
    loudspeaker_id: number
    confirm_penalty?: boolean
}
interface repealLoudspeakerData {
    code: number,
    message: string,
}
const repealLoudspeakerPoster = (params: repealLoudspeakerParams) => {
    const methodInstance = commonAlova.Post<repealLoudspeakerData>(
        'api/loudspeaker/repeal',
        params,
        {
            //第三个参数是config
            name: 'repealLoudspeakerPoster',
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
    loudspeakerData, loudspeakerDataParams, loudspeakerDataGetter, newLoudspeakerParams, newLoudspeakerPoster,
    repealLoudspeakerParams, repealLoudspeakerPoster
}