import { commonAlova } from '@/api/index';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()


//获取表情包萌活动数据
interface moeData {
    emoji_id: number,
    votes_num_total: number,
}
const moeDataGetter = (emoji_group_id: number) => {
    const methodInstance = commonAlova.Get<moeData[]>(
        'api/emoji_contest/' + emoji_group_id,
        {
            name: 'moeDataGetter-' + emoji_group_id,
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

//获取表情包萌活动用户投票的数据
interface moeUserVoteData {
    emoji_group_id: number,
    votes_num_total: number,
}
const moeUserVoteDataGetter = () => {
    const methodInstance = commonAlova.Get<moeUserVoteData[]>(
        'api/emoji_contest/show_user_votes',
        {
            name: 'moeUserVoteDataGetter',
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

//用户进行表情包萌活动投票
interface moeUserVoteParams {
    binggan: string,
    emoji_id: number,
    emoji_group_id: number,
    olo: number,
}
const moeUserVotePoster = (params: moeUserVoteParams) => {
    const methodInstance = commonAlova.Post(
        'api/emoji_contest/user_vote',
        params,
        {
            //第三个参数是config
            name: 'moeUserVotePoster',
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

export { moeData, moeDataGetter, moeUserVoteData, moeUserVoteDataGetter, moeUserVoteParams, moeUserVotePoster }