import { commonAlova } from '@/api/index';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()

//获取投票数据
interface voteData {
    vote_question: {
        id: number,
        title: string,
        end_date: string,
        vote_total: number,
        multiple: boolean,
        max_choices: number,
    },
    vote_options: {
        id: number,
        option_text: string,
        vote_total: number,
    }[],
    user_choices: {
        id: number,
        options_id: number[],
    } | null
}
const voteDataGetter = (vote_id: number) => {
    const methodInstance = commonAlova.Get<voteData>(
        'api/votes/' + vote_id,
        {
            name: 'voteDataGetter-' + vote_id,
            params: {
                binggan: userStore.binggan
            },
            localCache: null,
            hitSource: [],
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}

//用户进行投票
interface userVoteParams {
    binggan: string,
    vote_question_id: number,
    vote_options: number[],
}
const userVotePoster = (params: userVoteParams) => {
    const methodInstance = commonAlova.Post(
        'api/votes/',
        params,
        {
            //第三个参数是config
            name: 'userVotePoster',
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



export { voteData, voteDataGetter, userVoteParams, userVotePoster }