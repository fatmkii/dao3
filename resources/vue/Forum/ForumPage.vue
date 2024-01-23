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
import { useRouter } from 'vue-router'
import { useThreadsStore } from '@/stores/threads'
import { getThreadsDataParams } from '@/api/methods/threads'
import { defineProps, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCommonStore } from '@/stores/common'

//基础数据
const threadsStore = useThreadsStore()
const userStore = useUserStore()
const commonStore = useCommonStore()

//组件props
interface Props {
    forum_id: number //来自路由
    page: number //来自路由
}
const props = withDefaults(defineProps<Props>(), {

})

onMounted(() => {
    commonStore.showTopbarNav = false//使Topbar的“小火锅”隐藏
})
onUnmounted(() => {
    commonStore.showTopbarNav = true//使Topbar的“小火锅”显示
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