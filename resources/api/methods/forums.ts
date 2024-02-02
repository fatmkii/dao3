import { commonAlova, } from '@/api/index';

interface forumData<arrayType> {
    "id": number,
    "sub_id": number,
    "name": string,
    "description": string,
    "status": number,
    "is_anonymous": number,
    "accessible_coin": number,
    "is_nissin": number,
    "banners": arrayType,
    "default_heads": number,
    "deleted_at": string | null
}

const forumsDataGetter = commonAlova.Get(
    '/api/forums/',
    {
        name: 'forumsDataGetter',
        params: {},
        localCache: 60 * 60 * 1000,
        transformData(data: forumData<string>[], headers) {
            return data.map(item => ({
                ...item,
                banners: JSON.parse(item.banners) as string[]
            }));
        }
    }

)

export { forumsDataGetter, forumData }