<template>
    <n-flex vertical>
        这是ThreadPage
        <!-- <Teleport to="#topbar-nav"><router-link to="/" v-if="!threadsStore.threadsDataLoading">
                >{{ threadsStore.threadsListData.forum_data.name }}
                <n-tag round :size="commonStore.buttonSize">{{ threadsStore.threadsListData.forum_data.id }}</n-tag>
            </router-link>
        </Teleport> -->
    </n-flex>
</template>

<script setup lang="ts">
import { NFlex, NTag, useThemeVars, NCard, NText } from 'naive-ui'

//组件props
interface Props {
    thread_id: number //来自路由
    page: number //来自路由
}
const props = withDefaults(defineProps<Props>(), {

})


</script>