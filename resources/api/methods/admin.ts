import { commonAlova } from '@/api/index';


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
    deleteLoudspeakerParams, deleteLoudspeakerPoster
}