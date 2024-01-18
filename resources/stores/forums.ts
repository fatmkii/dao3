import { defineStore } from 'pinia'
import { useRequest } from 'alova';
import { forumsDataGetter } from '@/api/methods/forums';

export const useForumsStore = defineStore('forumsStore', () => {

    const { loading: forumsDataLoading, data: forumsData } = useRequest(
        forumsDataGetter,
        { initialData: [] }
    );
    
    return { forumsDataLoading, forumsData }

})

