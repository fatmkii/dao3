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
        hitSource: [/^user(?!DataGetter).*$/, 'newPostPoster', 'pingbiciAddPoster']
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
            localCache: { mode: 'restore', expire: 60 * 1000 },
            hitSource: ['newLoudspeakerPoster', 'repealLoudspeakerPoster', 'deleteLoudspeakerPoster']
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}

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

interface repealLoudspeakerParams {
    binggan: string,
    loudspeaker_id: number
}
const repealLoudspeakerPoster = (params: repealLoudspeakerParams) => {
    const methodInstance = commonAlova.Post(
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
    userDataGetter, userData, userRegisterPoster, userRewardParams, userRewardPoster,
    waterUnlockPoster, waterUnlockParams, myEmojisSetPoster, myEmojisSetParams, myEmojisAddPoster, myEmojisAddParams,
    checkRegisterRecordGetter, checkRegisterRecordData, incomeDataGetter, incomeSumDataGetter, incomeData, incomeParams,
    pingbiciAddPoster, pingbiciAddParams, loudspeakerData, loudspeakerDataParams, loudspeakerDataGetter, newLoudspeakerParams, newLoudspeakerPoster,
    repealLoudspeakerParams, repealLoudspeakerPoster
}