import { defineStore } from 'pinia'
import { useRequest } from 'alova';
import { forumsDataGetter } from '@/api/methods/forums';

export const useForumsStore = defineStore('forumsStore', () => {

    const { loading: forumsDataLoading, data: forumsData } = useRequest(
        forumsDataGetter,
        { initialData: [] }
    );

    function forumData(forumId: number) {
        return forumsData.value.find((forumData) => forumData.id === forumId)
    }

    return { forumsDataLoading, forumsData, forumData }

})

