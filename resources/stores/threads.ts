//暂时弃用threadsStore，数据还是放在组件就行

import { defineStore } from 'pinia'
import { useRequest } from 'alova';
import { threadsDataGetter } from '@/api/methods/threads';

export const useThreadsStore = defineStore('threadsStore', () => {

    const { loading: threadsDataLoading, data: threadsListData, send: getThreadsData } = useRequest(
        threadsDataGetter,
        { initialData: [], immediate: false }
    );

    return { threadsDataLoading, threadsListData, getThreadsData }

})

