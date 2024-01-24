<template>
    <n-flex vertical>
        这是forumPage
        <div>porps:{{ props }}</div>
        <div v-if="!threadsStore.threadsDataLoading">threadsListData:{{ threadsStore.threadsListData.threads_data.data }}
        </div>
        <Teleport to="#topbar-nav"><router-link to="/" v-if="!threadsStore.threadsDataLoading">
                >{{ threadsStore.threadsListData.forum_data.name }}
                <n-tag round :size="commonStore.buttonSize">{{ threadsStore.threadsListData.forum_data.id }}</n-tag>
            </router-link>
        </Teleport>
    </n-flex>
</template>

<script setup lang="ts">
import { NFlex, NTag } from 'naive-ui'
import { useThreadsStore } from '@/stores/threads'
import { getThreadsDataParams } from '@/api/methods/threads'
import { defineProps } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCommonStore } from '@/stores/common'
import { useTopbarNavControl } from '@/js/func/topbarNav'

//基础数据
const threadsStore = useThreadsStore()
const userStore = useUserStore()
const commonStore = useCommonStore()

//用teleport组件替代掉topbar的“小火锅”
useTopbarNavControl()

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