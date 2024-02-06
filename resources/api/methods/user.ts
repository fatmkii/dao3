import { commonAlova } from '@/api/index';

interface userData {
    binggan: {
        admin?: number | null,
        admin_forums?: string | null,
        nickname: string | null,
        coin: number,
        coin_in_bank: number,
        use_pingbici: boolean,
        new_msg: boolean,
        user_lv: number,
        locked_ttl: number,
    },
    my_battle_chara?: {
        name: string,
        not_use: boolean
    }[] | null
    pingbici: {
        content_pingbici: string
        fjf_pingbici: string
        title_pingbici: string
    } | null,
    my_emoji: string | null
}

const userDataGetter = (binggan: string) => commonAlova.Post(
    '/api/user/show',
    {
        binggan: binggan
    },
    {
        //第三个参数是config
        name: 'userDataGetter',
        params: {},
        localCache: { mode: 'placeholder', expire: 60 * 60 * 1000 },
        hitSource: [],
        transformData(data: userData, headers) {
            return {
                ...data,
                pingbici: data.pingbici === null ? null : {
                    content_pingbici: data.pingbici.content_pingbici === null ? null : JSON.parse(data.pingbici.content_pingbici) as string[],
                    fjf_pingbici: data.pingbici.fjf_pingbici === null ? null : JSON.parse(data.pingbici.fjf_pingbici) as string[],
                    title_pingbici: data.pingbici.title_pingbici === null ? null : JSON.parse(data.pingbici.title_pingbici) as string[],
                },
                my_emoji: data.my_emoji === null ? null : JSON.parse(data.my_emoji) as string[],
            }
        }
    }
)

interface userRegisterData {
    "binggan": string,
    "token": string,
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

export { userDataGetter, userRegisterPoster }
export type { userData }