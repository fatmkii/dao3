import { commonAlova } from '@/api/index';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()

//获取投票数据
interface crowdData {
    crowd: {
        id: number,
        thread_id: number,
        title: string,
        end_date: string,
        olo_total: number,
        olo_target: number,
        is_closed: 0 | 1 | 2, //0=进行中；1=已正常结束（众筹成功）；2=已中止
    },
    crowd_record: {
        id: number,
        olo: number,
        created_at: string,
    }[] | null
}
const crowdDataGetter = (crowd_id: number) => {
    const methodInstance = commonAlova.Get<crowdData>(
        'api/crowds/' + crowd_id,
        {
            name: 'crowdDataGetter-' + crowd_id,
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

//用户参与众筹
interface userCrowdParams {
    binggan: string,
    crowd_id: number,
    crowd_olo: number,
}
const userCrowdPoster = (params: userCrowdParams) => {
    const methodInstance = commonAlova.Post(
        'api/crowds/',
        params,
        {
            //第三个参数是config
            name: 'userCrowdPoster',
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

//管理员中止众筹
interface adminCrowdRepealParams {
    binggan: string,
    crowd_id: number,
}
const adminCrowdRepealPoster = (params: adminCrowdRepealParams) => {
    const methodInstance = commonAlova.Post(
        'api/crowds/repeal',
        params,
        {
            //第三个参数是config
            name: 'adminCrowdRepealPoster',
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



export {
    crowdData, crowdDataGetter, userCrowdParams, userCrowdPoster,
    adminCrowdRepealParams, adminCrowdRepealPoster
}