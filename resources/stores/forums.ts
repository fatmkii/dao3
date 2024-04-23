import { defineStore } from 'pinia'
import { useRequest } from 'alova';
import { forumsDataGetter, threadsListGetter } from '@/api/methods/forums';

export const useForumsStore = defineStore('forumsStore', () => {

    //请求所有板块信息
    const { loading: forumsDataLoading, data: forumsData, send: getForumsData } = useRequest(
        forumsDataGetter,
        { initialData: [], immediate: false }
    );
    getForumsData()

    //根据forumId获得某个版的数据
    function forumData(forumId: number) {
        return forumsData.value.find((forumData) => forumData.id === forumId)
    }

    //请求该板块的主题列表（好像没必要存在store）
    // const { loading: threadsListLoading, data: threadsListData, send: getThreadsData } = useRequest(
    //     threadsListGetter,
    //     { initialData: [], immediate: false }
    // );

    return { forumsDataLoading, forumsData, forumData, getForumsData }

})

