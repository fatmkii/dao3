<template>
    <n-flex vertical size="small">
        <n-card title="一般设定" size="small" >
            <template #header-extra>
                <n-text :depth="3">这些设定保存在本设备，不跟随饼干</n-text>
            </template>
            <n-form ref="formRef" :model="userInput" label-placement="left" label-width="auto"
                :size="commonStore.isMobile ? 'small' : 'medium'" style="max-height: 645px; overflow-y: auto;">
                <n-grid cols="1 600:2" :x-gap="12">
                    <n-gi style="max-width: 280px;">
                        <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
                            <n-text depth="3" style="font-size: 0.875rem;">功能选项 </n-text>
                        </n-divider>
                        <n-form-item label="图床选择" path="loudspeakerPosition">
                            <n-select v-model:value="userInput.imgHost" :options="imgHostOptions"
                                :menu-props="{ style: { borderRadius: '10px' } }" />
                        </n-form-item>
                        <n-form-item label="自动涮锅时遇红包停止" path="hongbaoThenStop">
                            <n-switch v-model:value="userInput.hongbaoThenStop" />
                        </n-form-item>
                        <n-form-item label="自动涮锅时页面不动" path="holdPageWhenListening">
                            <n-switch v-model:value="userInput.holdPageWhenListening" />
                        </n-form-item>
                        <n-form-item label="减少弹出提示" path="lessToast">
                            <n-switch v-model:value="userInput.lessToast" />
                        </n-form-item>
                    </n-gi>
                    <n-gi style="max-width: 280px;">
                        <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
                            <n-text depth="3" style="font-size: 0.875rem;">基本外观 </n-text>
                        </n-divider>
                        <n-form-item label="传统式回复框" path="postLegacyMode">
                            <n-switch v-model:value="userInput.postLegacyMode" />
                        </n-form-item>
                        <n-form-item label="大喇叭和标题单色" path="monochromeMode">
                            <n-switch v-model:value="userInput.monochromeMode" />
                        </n-form-item>
                        <n-form-item label="侧边栏放左边" path="sidebarLeft">
                            <n-switch v-model:value="userInput.sidebarLeft" />
                        </n-form-item>
                        <n-form-item label="大喇叭位置" path="loudspeakerPosition">
                            <n-select v-model:value="userInput.loudspeakerPosition"
                                :options="loudspeakerPositionOptions"
                                :menu-props="{ style: { borderRadius: '10px' } }" />
                        </n-form-item>
                        <n-form-item label="最大引用层数" path="quoteMax">
                            <n-input-number v-model:value="userInput.quoteMax" :max="6" :min="1" :step="1">
                                <template #suffix>
                                    层
                                </template>
                            </n-input-number>
                        </n-form-item>
                        <n-form-item label="回复行数限高" path="foldMaxLine">
                            <n-input-number v-model:value="userInput.foldMaxLine" :max="99" :min="6" :step="1">
                                <template #suffix>
                                    行
                                </template>
                            </n-input-number>
                        </n-form-item>
                    </n-gi>
                    <n-gi style="max-width: 280px;">
                        <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
                            <n-text depth="3" style="font-size: 0.875rem;">字体大小 </n-text>
                        </n-divider>
                        <n-form-item label="回复内容" path="fontSizePost">
                            <n-input-number v-model:value="userInput.fontSizePost" :max="24" :min="10" :step="0.5">
                                <template #suffix>
                                    px
                                </template>
                            </n-input-number>
                        </n-form-item>
                        <n-form-item label="引用内容" path="fontSizeQuote">
                            <n-input-number v-model:value="userInput.fontSizeQuote" :max="24" :min="10" :step="0.5">
                                <template #suffix>
                                    px
                                </template>
                            </n-input-number>
                        </n-form-item>
                        <n-form-item label="回复脚注" path="fontSizeFooter">
                            <n-input-number v-model:value="userInput.fontSizeFooter" :max="22" :min="8" :step="0.5">
                                <template #suffix>
                                    px
                                </template>
                            </n-input-number>
                        </n-form-item>
                        <n-form-item label="主题列表" path="fontSizeThreadList">
                            <n-input-number v-model:value="userInput.fontSizeThreadList" :max="24" :min="10"
                                :step="0.5">
                                <template #suffix>
                                    px
                                </template>
                            </n-input-number>
                        </n-form-item>
                        <n-form-item label="主题列表脚注" path="fontSizeThreadListFooter">
                            <n-input-number v-model:value="userInput.fontSizeThreadListFooter" :max="22" :min="8"
                                :step="0.5">
                                <template #suffix>
                                    px
                                </template>
                            </n-input-number>
                        </n-form-item>
                        <n-form-item label="输入框" path="fontSizeInput">
                            <n-input-number v-model:value="userInput.fontSizeInput" :max="24" :min="10"
                                :step="0.5">
                                <template #suffix>
                                    px
                                </template>
                            </n-input-number>
                        </n-form-item>
                    </n-gi>
                    <n-gi style="max-width: 280px;">
                        <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
                            <n-text depth="3" style="font-size: 0.875rem;">间距相关 </n-text>
                        </n-divider>
                        <n-form-item label="回复内容行距" path="lineHeightPost">
                            <n-input-number v-model:value="userInput.lineHeightPost" :max="40" :min="16" :step="2">
                                <template #suffix>
                                    px
                                </template>
                            </n-input-number>
                        </n-form-item>
                        <n-form-item label="回复内容上下间距" path="postInnerMargin">
                            <n-input-number v-model:value="userInput.postInnerMargin" :max="30" :min="0" :step="1">
                                <template #suffix>
                                    px
                                </template>
                            </n-input-number>
                        </n-form-item>
                        <n-form-item label="回复卡片四周空白" path="postCardPadding">
                            <n-input-number v-model:value="userInput.postCardPadding" :max="20" :min="4" :step="1">
                                <template #suffix>
                                    px
                                </template>
                            </n-input-number>
                        </n-form-item>
                        <n-form-item label="主题内容上下间距" path="threadListInnerMargin">
                            <n-input-number v-model:value="userInput.threadListInnerMargin" :max="30" :min="0" :step="1">
                                <template #suffix>
                                    px
                                </template>
                            </n-input-number>
                        </n-form-item>
                        <n-form-item label="主题卡片四周空白" path="threadListCardPadding">
                            <n-input-number v-model:value="userInput.threadListCardPadding" :max="20" :min="4"
                                :step="1">
                                <template #suffix>
                                    px
                                </template>
                            </n-input-number>
                        </n-form-item>
                    </n-gi>
                </n-grid>
            </n-form>
            <!-- 实时预览用组件 -->
        </n-card>
        <n-divider style="margin-top: 2px;margin-bottom: 2px;" />
        <PostItem :post-data="postDataForPreview" :forum-id="0" :preview-mode="true" />
        <n-divider style="margin-top: 2px;margin-bottom: 2px;" />
        <ThreadList :threads-list-data="threadListDataForPreview" :show-this="true" />
    </n-flex>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import ThreadList from '@/vue/Forum/ThreadList.vue';
import PostItem from '@/vue/Thread/PostItem/PostItem.vue';
import { NCard, NDivider, NFlex, NForm, NFormItem, NGi, NGrid, NInputNumber, NSelect, NSwitch, NText } from 'naive-ui';

//基础数据
const commonStore = useCommonStore()


//收集表单的输入数据， 最后返回给父组件
const userInput = commonStore.userCustom

//大喇叭放置位置选项
const loudspeakerPositionOptions = [
    { value: 'top', label: '放在顶部' },
    { value: 'center', label: '放在中间' },
    { value: 'bottom', label: '放在底部' },
]
//图床选项
const imgHostOptions = [
    { value: 'mjj', label: 'mjj' },
    { value: 'imgbb', label: 'imgbb' },
    { value: 'freeimage', label: 'freeimage' },
]

//实时预览用的虚拟postData
const postDataForPreview = {
    id: 0,
    created_at: '2021-04-28 00:44:23',
    is_deleted: 0,//0=正常；1=被用户删除；2=被管理员删除
    thread_id: 0,
    battle_id: null,
    hongbao_id: null,
    floor: 0,
    random_head: 1,
    created_by_admin: 0, //0=一般用户 1=管理员发布，2=系统发布
    content: `<span class='quote-content'>这是引用内容 <br>@№0 = = 2021-04-28 00:44:23</span><br>这是预览模式，可以确认上面设定的式样是否满意。<br>这是第二行。<br>这是第三行。`,
    nickname: '= =',
    is_your_post: true,
    hongbao_data: null
}

const threadListDataForPreview = [{
    id: 0,
    sub_id: 0,
    forum_id: 1,
    vote_question_id: null,
    gamble_question_id: null,
    crowd_id: null,
    hongbao_id: null,
    nickname: '= =',
    title: '这是预览模式，可以确认上面设定的式样是否满意。',
    sub_title: '[预览]',
    random_heads_group: 1,
    posts_num: 100,
    title_color: null,
    anti_jingfen: false,
    nissin_date: null,
    has_nissined: false,
    can_battle: false,
    is_delay: false,
    locked_by_coin: 0,
    is_private: false,
    created_at: null,
    updated_at: null
}]

</script>