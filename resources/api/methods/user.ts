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
    } | null,
    my_emoji: string[] | null,
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
        hitSource: [/^user(?!DataGetter).*$/, 'newPostPoster']
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
        {
            ...params,
            my_emoji: JSON.stringify(params.my_emoji),
            emoji_excluded: JSON.stringify(params.emoji_excluded)
        },
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
        {
            ...params,
            my_emoji: params.my_emoji,
        },
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



export {
    userDataGetter, userData, userRegisterPoster, userRewardParams, userRewardPoster,
    waterUnlockPoster, waterUnlockParams, myEmojisSetPoster, myEmojisSetParams, myEmojisAddPoster, myEmojisAddParams,
    checkRegisterRecordGetter, checkRegisterRecordData, incomeDataGetter, incomeSumDataGetter, incomeData, incomeParams
}