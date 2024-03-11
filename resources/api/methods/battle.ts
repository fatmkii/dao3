import { commonAlova } from '@/api/index';

//发起大乱斗
interface battleCreateParams {
    binggan: string,
    forum_id: number,
    thread_id: number,
    battle_olo: number,
    chara_id: number,
    is_custom_chara: boolean,
    chara_group: number,
    new_post_key: string,
    timestamp: number,
}
const battleCreatePoster = (params: battleCreateParams) => {
    const methodInstance = commonAlova.Post(
        'api/battles/',
        params,
        {
            //第三个参数是config
            name: 'battleCreatePoster',
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

//挑战者加入大乱斗
interface battleChanllengerRollParams {
    binggan: string,
    battle_id: number,
    chara_id: number,
    is_custom_chara: number,
}
const battleChanllengerRollPoster = (params: battleChanllengerRollParams) => {
    const methodInstance = commonAlova.Post(
        'api/battles/c_roll/',
        params,
        {
            //第三个参数是config
            name: 'battleChanllengerRollPoster',
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



export { battleCreateParams, battleCreatePoster, battleChanllengerRollParams, battleChanllengerRollPoster }