import { commonAlova } from '@/api/index';

interface userData {
    "binggan": {
        'admin'?: number | null,
        'admin_forums'?: string | null,
        "nickname": string | null,
        "coin": number,
        "coin_in_bank": number,
        "use_pingbici": boolean,
        "new_msg": boolean,
        "user_lv": number,
        "locked_ttl": number,
    },
    "my_battle_chara"?: object | null
    "pingbici": object | null,
    "my_emoji": object | null
}

const userDataGetter = (binggan: string) =>
    commonAlova.Post<userData>(
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
        }
    )


export { userDataGetter }
export type { userData }