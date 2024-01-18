import { commonAlova, } from '@/api/index';

interface forumsData {
    "id": number,
    "sub_id": number,
    "name": string,
    "description": string,
    "status": number,
    "is_anonymous": number,
    "accessible_coin": number,
    "is_nissin": number,
    "banners": string,
    "default_heads": number,
    "deleted_at": string | null
}

const forumsDataGetter = commonAlova.Get<forumsData[]>(
    '/api/forums/',
    {
        name: 'forumsDataGetter',
        params: {},
        localCache: 60 * 60 * 1000
    }
)

export { forumsDataGetter }