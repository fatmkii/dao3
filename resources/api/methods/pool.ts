import { commonAlova } from '@/api/index';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()

//祝福池活动投入祝福
interface poolStoreParams {
    binggan: string,
    olo: number,
    message: string,
    thread_id: number,
    forum_id: number,
    admin: boolean,
}
const poolStorePoster = (params: poolStoreParams) => {
    const methodInstance = commonAlova.Post(
        'api/store_pool',
        params,
        {
            //第三个参数是config
            name: 'poolStorePoster',
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


//祝福池活动获取数据
interface getPoolData {
    olo_total: number,
    user_pool: {
        olo: number,
        floor: number,
        result: number,
        message: string,
        created_at: string,
    } | null
}
const poolDataGetter = () => {
    const methodInstance = commonAlova.Get<getPoolData>(
        'api/get_pool',
        {
            name: 'poolDataGetter',
            params: {
                binggan: userStore.binggan
            },
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}

export { poolStoreParams, poolStorePoster, getPoolData, poolDataGetter }
