<template>
    <n-flex vertical>
        这是forumPage
        <div>porps:{{ props }}</div>
        <div v-if="!threadsStore.threadsDataLoading">threadsListData:{{ threadsStore.threadsListData.threads_data.data}}</div>
    </n-flex>
</template>

<script setup lang="ts">
import { NFlex } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useThreadsStore } from '@/stores/threads'
import { getThreadsDataParams } from '@/api/methods/threads'
import { defineProps } from 'vue'
import { useUserStore } from '@/stores/user'

//基础数据
const threadsStore = useThreadsStore()
const userStore = useUserStore()

//组件props
interface Props {
    forum_id: number //来自路由
    page: number //来自路由
}
const props = withDefaults(defineProps<Props>(), {

})

//获取主题列表数据
const params: getThreadsDataParams = {
    forumId: props.forum_id,
    binggan: userStore.binggan!,
    page: props.page,
    threadsPerPage: 50,
    subtitlesExcluded: [],
    searchTitle: ''
}
threadsStore.getThreadsData(params)

</script>