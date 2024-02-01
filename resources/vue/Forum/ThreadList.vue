<template>
    <n-flex vertical :size="2">
        <n-card v-for=" threadData  in  threadsListData" size="small" :bordered="true" :key="threadData.id"
            class="thread-cards" :content-style="threadCardsContentStyle" hoverable>
            <n-flex vertical>
                <div :style="{ color: threadData.title_color ? threadData.title_color : themeVars.textColor1 }"
                    class="thread-title">
                    {{ threadData.sub_title }}
                    <router-link :to="{ name: 'thread', params: { thread_id: threadData.id } }"
                        :style="{ color: threadData.title_color ? threadData.title_color : themeVars.textColor1 }">
                        {{ threadData.title }}
                    </router-link>
                    <router-link
                        :to="{ name: 'thread', params: { thread_id: threadData.id, page: Math.ceil((threadData.posts_num + 1) / 200) } }"
                        v-if="threadData.posts_num > 200">
                        [{{ Math.ceil((threadData.posts_num + 1) / 200) }}]
                    </router-link>
                </div>
                <n-flex size="small" class="thread-title-secondary">
                    <span><n-text depth="3">最新回复:</n-text> {{ threadData.updated_at }}</span>

                    <span><n-text depth="3">发帖人:</n-text> {{ threadData.nickname }} </span>
                    <span style="margin-left: auto;"></span>
                    {{ threadData.posts_num > 1200 ? '🔥' : '' }}
                    {{ threadData.vote_question_id ? '🗳️' : '' }}
                    {{ threadData.gamble_question_id ? '🎲' : '' }}
                    {{ threadData.crowd_id ? '💰' : '' }}
                    {{ threadData.hongbao_id ? '🧧' : '' }}
                    <span><n-text depth="3">Re:</n-text> {{ threadData.posts_num }}</span>
                </n-flex>
            </n-flex>
        </n-card>

    </n-flex>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCommonStore } from '@/stores/common'
import { NFlex, NTag, useThemeVars, NCard, NText } from 'naive-ui'
import type { threadData } from '@/api/methods/threads'


//基础数据
const commonStore = useCommonStore()
const themeVars = useThemeVars()
const router = useRouter()

//组件props
interface Props {
    threadsListData: threadData[],
}
const props = withDefaults(defineProps<Props>(), {

})


//外观调整
const threadCardsContentStyle = computed(() => {
    return {
        paddingBottom: commonStore.isMobile ? '6px' : '',
    }
})



</script>



<style lang="scss" scoped>
.thread-cards {
    &:hover {
        background-color: v-bind('themeVars.hoverColor');
    }
}

.thread-title-secondary {
    font-size: v-bind('commonStore.isMobile ? "0.6rem" : "0.8rem"');

    span {
        font-size: v-bind('commonStore.isMobile ? "0.6rem" : "0.8rem"')
    }
}
</style>