import { commonAlova } from '@/api/index';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()

//获取菠菜数据
interface gambleData {
    gamble_question: {
        id: number,
        title: string,
        end_date: string,
        bet_total: number,
        olo_total: number,
        result_option_id: number | null,
        is_closed: 0 | 1 | 2, //0=进行中，1=已结束，2=已中止
    },
    gamble_options: {
        id: number,
        option_text: string,
        bet_total: number,
        olo_total: number,
        odds: number,
    }[],
    user_choices: userChoiceData[] | null
}
interface userChoiceData {
    id: number,
    option_id: number,
    betting_olo: number,
    odds: number | null,
    win_olo: number | null,
}
const gambleDataGetter = (gamble_id: number) => {
    const methodInstance = commonAlova.Get<gambleData>(
        'api/gambles/' + gamble_id,
        {
            name: 'gambleDataGetter-' + gamble_id,
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

//用户进行菠菜
interface userGambleParams {
    binggan: string,
    gamble_question_id: number,
    bet_option: number,
    betting_olo: number,
}
const userGamblePoster = (params: userGambleParams) => {
    const methodInstance = commonAlova.Post(
        'api/gambles/',
        params,
        {
            //第三个参数是config
            name: 'userGamblePoster',
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


//管理员开奖菠菜
interface adminGambleCloseParams {
    binggan: string,
    gamble_question_id: number,
    result_option: number,
}
const adminGambleClosePoster = (params: adminGambleCloseParams) => {
    const methodInstance = commonAlova.Post(
        'api/gambles/close',
        params,
        {
            //第三个参数是config
            name: 'adminGambleClosePoster',
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

//管理员中止菠菜
interface adminGambleRepealParams {
    binggan: string,
    gamble_question_id: number,
}
const adminGambleRepealPoster = (params: adminGambleRepealParams) => {
    const methodInstance = commonAlova.Post(
        'api/gambles/repeal',
        params,
        {
            //第三个参数是config
            name: 'adminGambleRepealPoster',
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
    gambleData, gambleDataGetter, userGambleParams, userGamblePoster, userChoiceData,
    adminGambleCloseParams, adminGambleClosePoster, adminGambleRepealParams, adminGambleRepealPoster,
}