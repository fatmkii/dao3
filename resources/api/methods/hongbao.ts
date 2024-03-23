import { commonAlova } from '@/api/index';

//发送新红包
interface hongbaoPostCreateParams {
    binggan: string,
    forum_id: number,
    thread_id: number,
    hongbao_olo: number,
    hongbao_num: number,
    type: 1 | 2, //1=随机红包, 2=定额红包
    key_word_type: 1 | 2 | 3,//1=普通口令红包, 2=抢答红包(答案不显示、回复显示), 3=暗号红包(答案回复都不显示)
    hongbao_key_word: string,
    hongbao_question: string | undefined, //普通红包的时候，可以为undefined
    // hongbao_message: string,//3.0代码直接使用下面的hongbao_message_json
    hongbao_message_json: string[],
    hongbao_olo_hide: boolean,
}
const hongbaoPostCreatePoster = (params: hongbaoPostCreateParams) => {
    const methodInstance = commonAlova.Post(
        'api/hongbao_post/create',
        params,
        {
            //第三个参数是config
            name: 'hongbaoPostCreatePoster',
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

//抢红包
interface hongbaoPostStoreParams {
    binggan: string,
    forum_id: number,
    thread_id: number,
    content: string,
    nickname: string,
    post_with_admin: boolean,
    new_post_key: string,
    timestamp: number,
    hongbao_post_id: number,
    hongbao_key_word: string
}
const hongbaoPostStorePoster = (params: hongbaoPostStoreParams) => {
    const methodInstance = commonAlova.Post(
        'api/hongbao_post/store',
        params,
        {
            //第三个参数是config
            name: 'hongbaoPostStorePoster',
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

export { hongbaoPostCreateParams, hongbaoPostCreatePoster, hongbaoPostStoreParams, hongbaoPostStorePoster }