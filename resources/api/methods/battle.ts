import { commonAlova } from '@/api/index';

//获取大乱斗数据
interface battleData {
    battle: {
        id: number,
        chara_group: number,
        progress: number,//0=等待挑战者；1=挑战者已参加；2=正常结束；3=超时关闭
        initiator_is_custom_chara: boolean,
        challenger_is_custom_chara: boolean,
        result: number, //0=进行中；1=发起者胜利；2=挑战者胜利；3=平局
        battle_olo: number,
        is_your_battle: boolean,
        you_are_challenger: boolean
    },
    battle_messages: {
        battle_id: number,
        chara_url: string,
        message_type: number,
        message: string
    }[]
}
const battleDataGetter = (battle_id: number) => {
    const methodInstance = commonAlova.Get<battleData>(
        'api/battles/' + battle_id,
        {
            name: 'battleDataGetter-' + battle_id,
            params: {},
            localCache: {
                //持久化的缓存，即使浏览器刷新也不会消失。
                //在它的onSuccess里面要设置，获得大乱斗数据判断，如果大乱斗还没关闭就立刻失效它的缓存
                mode: 'restore',
                expire: 60 * 10 * 1000,
            },
            hitSource: [],
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}


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



export { battleCreateParams, battleCreatePoster, battleChanllengerRollParams, battleChanllengerRollPoster, battleData, battleDataGetter }