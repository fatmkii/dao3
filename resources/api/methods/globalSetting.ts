import { commonAlova } from '@/api/index';


const newBingganEnableGetter = commonAlova.Get<boolean>(
    '/api/new_binggan_enable/',
    {
        name: 'newBingganEnableGetter',
        params: {},
        localCache: null,
    }
)

export { newBingganEnableGetter }