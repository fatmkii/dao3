import { commonAlova } from '@/api/index';


//获取用户数据
interface userData {
    binggan: {
        admin?: number | null,
        admin_forums?: number[],
        nickname: string | null,
        coin: number,
        coin_in_bank: number,
        use_pingbici: boolean,
        new_msg: boolean,
        user_lv: number,
        locked_ttl: number,
    },
    my_battle_chara: { name: string, not_use: boolean }[]
    pingbici: {
        content_pingbici: string[]
        fjf_pingbici: string[]
        title_pingbici: string[]
    },
    my_emoji: string[],
    emoji_excluded: number[]
}
const userDataGetter = (binggan: string) => commonAlova.Post<userData>(
    '/api/user/show',
    {
        binggan: binggan
    },
    {
        //第三个参数是config
        name: 'userDataGetter',
        params: {},
        localCache: { mode: 'placeholder', expire: 60 * 60 * 1000 },
        hitSource: [/^user(?!DataGetter).*$/, 'newPostPoster', 'pingbiciAddPoster', 'pingbiciSetPoster', 'myEmojisAddPoster', 'myEmojisSetPoster']
    }
)

//用户注册
interface userRegisterData {
    binggan: string,
    token: string,
}
const userRegisterPoster = (registerKey: string) => commonAlova.Post<userRegisterData>(
    'api/user/register',
    {
        register_key: registerKey
    },
    {
        //第三个参数是config
        name: 'userRegisterPoster',
        params: {},
        localCache: null,
        hitSource: [],
    }
)

//打赏用户功能
interface userRewardParams {
    binggan: string,
    post_floor_message: string,
    forum_id: number,
    thread_id: number,
    post_id: number,
    coin: number,
    content?: string,
}
const userRewardPoster = (params: userRewardParams) => {
    const methodInstance = commonAlova.Post(
        'api/user/reward',
        params,
        {
            //第三个参数是config
            name: 'userRewardPoster',
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

//输入验证码解除灌水锁定
interface waterUnlockParams {
    binggan: string,
    captcha_key: string,
    captcha_code: string,
}
const waterUnlockPoster = (params: waterUnlockParams) => {
    const methodInstance = commonAlova.Post(
        'api/user/water_unlock',
        params,
        {
            //第三个参数是config
            name: 'waterUnlockPoster',
            params: {},
            localCache: null,
            hitSource: [],
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}

//设定自定义表情包
interface myEmojisSetParams {
    binggan: string,
    my_emoji: string[],
    emoji_excluded: number[],
}
const myEmojisSetPoster = (params: myEmojisSetParams) => {
    const methodInstance = commonAlova.Post(
        'api/user/my_emoji_set',
        params,
        {
            //第三个参数是config
            name: 'myEmojisSetPoster',
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

//追加自定义表情包
interface myEmojisAddParams {
    binggan: string,
    my_emoji: string,
}
const myEmojisAddPoster = (params: myEmojisAddParams) => {
    const methodInstance = commonAlova.Post(
        'api/user/my_emoji_add',
        params,
        {
            //第三个参数是config
            name: 'myEmojisAddPoster',
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

//追加自定义表情包
interface checkRegisterRecordData {
    reg_record_TTL: number,
}
const checkRegisterRecordGetter = () => {
    const methodInstance = commonAlova.Get<{ reg_record_TTL: number }>(
        'api/user/check_reg_record',
        {
            name: 'checkRegisterRecordPoster',
            params: {},
            localCache: null,
            hitSource: [],
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}

//查询olo收益表
interface incomeData {
    created_at: string,
    olo: number,
    content: string | null,
    thread_id: number | null,
    thread_title: string | null,
    floor: number | null
}
interface incomeSumData {
    sum_year: number,
    sum_month: number,
}
interface incomeParams {
    income_date: string, //required|date|after_or_equal:2022-01-01
}
const incomeDataGetter = (params: incomeParams) => {
    const methodInstance = commonAlova.Get<incomeData[]>(
        'api/income/show_day',
        {
            name: 'incomeDataGetter',
            params: params,
            localCache: null,
            hitSource: [],
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}
const incomeSumDataGetter = (params: incomeParams) => {
    const methodInstance = commonAlova.Get<incomeSumData>(
        'api/income/show_sum',
        {
            name: 'incomeSumDataGetter',
            params: params,
            localCache: 60 * 1000,
            hitSource: [],
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}

// 设定屏蔽词
interface pingbiciSetParams {
    binggan: string,
    use_pingbici: boolean,
    content_pingbici: string[],
    title_pingbici: string[],
    fjf_pingbici: string[],
}
const pingbiciSetPoster = (params: pingbiciSetParams) => {
    const methodInstance = commonAlova.Post(
        'api/user/pingbici_set',
        params,
        {
            //第三个参数是config
            name: 'pingbiciSetPoster',
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


// 追加屏蔽词
interface pingbiciAddParams {
    binggan: string,
    content_pingbici: string,
}
const pingbiciAddPoster = (params: pingbiciAddParams) => {
    const methodInstance = commonAlova.Post(
        'api/user/pingbici_add',
        params,
        {
            //第三个参数是config
            name: 'pingbiciAddPoster',
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

//获取已经获得的成就
interface getMedalsDataParams {
    binggan: string,
}
const getMedalsDataPoster = (params: getMedalsDataParams) => {
    const methodInstance = commonAlova.Post<number[]>(
        'api/user/show_medals',
        params,
        {
            //第三个参数是config
            name: 'getMedalsDataPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}

//获得某个成就的进度
interface getMedalProgressParams {
    binggan: string,
    medal_id: number
}
interface medalProgressData {
    medal_id: number,
    threshold: number,
    progress: number | null,
    medal_created_at: string | null
}
const getMedalProgressPoster = (params: getMedalProgressParams) => {
    const methodInstance = commonAlova.Post<medalProgressData>(
        'api/user/show_medal_progress',
        params,
        {
            //第三个参数是config
            name: 'getMedalProgressPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}


//查询银行存款
interface getBankDataParams {
    binggan: string,
}
interface bankData {
    id: number,
    olo: number,
    description: string,
    expire_date: string,
    created_at: string,
}
const getBankDataPoster = (params: getBankDataParams) => {
    const methodInstance = commonAlova.Post<bankData[]>(
        'api/user/show_bank',
        params,
        {
            //第三个参数是config
            name: 'getBankDataPoster',
            params: {},
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}

// 存入银行
interface bankDepositParams {
    binggan: string,
    olo: number,
    description?: string,
    expire_date: string,
}
const bankDepositPoster = (params: bankDepositParams) => {
    const methodInstance = commonAlova.Post(
        'api/user/bank_deposit',
        params,
        {
            //第三个参数是config
            name: 'bankDepositPoster',
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

// 从银行取款
interface bankWithdrawParams {
    binggan: string,
    deposit_id: number,
    confirm_penalty: boolean,
}
const bankWithdrawPoster = (params: bankWithdrawParams) => {
    const methodInstance = commonAlova.Post(
        'api/user/bank_withdraw',
        params,
        {
            //第三个参数是config
            name: 'bankWithdrawPoster',
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

//查询饼干等级信息
interface getUserLevelParams {
    binggan: string,
}
interface userLevelData {
    title_pingbici: number,
    content_pingbici: number,
    fjf_pingbici: number,
    my_emoji: number,
    my_battle_chara: number
}
const getUserLevelGetter = (params: getUserLevelParams) => {
    const methodInstance = commonAlova.Get<userLevelData>(
        'api/user/user_lv_show',
        {
            name: 'getUserLevelGetter',
            params: params,
            localCache: null,
            hitSource: []
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}

// 饼干升级
type userLevelUpMode = 'title_pingbici' | 'content_pingbici' | 'fjf_pingbici' | 'my_emoji' | 'my_battle_chara'
interface userLevelUpParams {
    binggan: string,
    mode: userLevelUpMode,
}
const userLevelUpPoster = (params: userLevelUpParams) => {
    const methodInstance = commonAlova.Post(
        'api/user/user_lv_up',
        params,
        {
            //第三个参数是config
            name: 'userLevelUpPoster',
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
    userDataGetter, userData, userRegisterPoster, userRewardParams, userRewardPoster,
    waterUnlockPoster, waterUnlockParams, myEmojisSetPoster, myEmojisSetParams, myEmojisAddPoster, myEmojisAddParams,
    pingbiciSetParams, pingbiciSetPoster,
    checkRegisterRecordGetter, checkRegisterRecordData, incomeDataGetter, incomeSumDataGetter, incomeData, incomeParams,
    pingbiciAddPoster, pingbiciAddParams, getMedalsDataParams,
    getMedalsDataPoster, getMedalProgressPoster, getMedalProgressParams,
    getBankDataParams, bankData, getBankDataPoster, bankDepositParams, bankDepositPoster, bankWithdrawParams, bankWithdrawPoster,
    getUserLevelParams, userLevelData, getUserLevelGetter, userLevelUpMode, userLevelUpParams, userLevelUpPoster
}