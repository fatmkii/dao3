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

