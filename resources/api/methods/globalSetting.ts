import { commonAlova } from '@/api/index';


const newBingganEnableGetter = commonAlova.Get<boolean>(
    '/api/new_binggan_enable/',
    {
        name: 'newBingganEnableGetter',
        params: {},
        localCache: null,
    }
)
const homeBannersGetter = commonAlova.Get<string[]>(
    '/api/home_banners/',
    {
        name: 'homeBannersGetter',
        params: {},
        localCache: { mode: 'placeholder', expire: 60 * 60 * 1000 },
    }
)

const newLoudspeakerEnableGetter = commonAlova.Get<boolean>(
    '/api/new_loudspeaker_enable',
    {
        name: 'newLoudspeakerEnableGetter',
        params: {},
        localCache: null,
    }
)


export { newBingganEnableGetter, homeBannersGetter, newLoudspeakerEnableGetter }