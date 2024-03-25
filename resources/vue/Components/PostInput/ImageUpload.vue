<template>
    <!-- 咒岛专用上传图片 -->
    <n-upload v-if="forumId === 419" accept="image/*" action="/api/img_upload" :custom-request="customRequest"
        :show-file-list="false" :max="1" ref="NUploadCom">
        <f-button style="margin-right: auto;" :disabled="userIsLocked" :loading="uploading">上传图片</f-button>
    </n-upload>
    <!-- 一般上传图片 -->
    <f-button v-else style="margin-right: auto;" :disabled="userIsLocked" data-target="#content-input"
        id="upload-button">上传图片</f-button>
</template>

<script setup lang="ts">
import { useCommonStore, type imgHostType } from '@/stores/common'
import { FButton } from '@custom'
import { NUpload, type UploadCustomRequestOptions } from 'naive-ui'
import { onMounted, onUnmounted, ref } from 'vue'
import { uploadImagePoster, type uploadImageParams } from '@/api/methods/common'
import { useUserStore } from '@/stores/user'

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()
const NUploadCom = ref<InstanceType<typeof NUpload> | null>(null)

//组件props
interface Props {
    userIsLocked: boolean,
    forumId: number,
    threadId: number
}
const props = withDefaults(defineProps<Props>(), {
})


//各种emit
const emit = defineEmits<{
    insertImage: [ImgSrc: string],
}>()


//免费图床配置
function setImguploadPlugin(station: imgHostType) {
    //手动载入插图插件
    var body = document.getElementsByTagName("body")[0];
    var pup = document.createElement("script");
    pup.setAttribute("id", "image-upload-js");
    var button = document.getElementById('upload-button');
    if (station == 'mjj') {
        pup.setAttribute("async", 'true');
        pup.setAttribute("src", "https://mjj.today/sdk/pup.js");
        pup.setAttribute("data-url", "https://mjj.today/upload");
        pup.setAttribute("data-auto-insert", "html-embed");
        button?.setAttribute("data-chevereto-pup-trigger", "")
    }
    if (station == 'imgbb') {
        pup.setAttribute("async", 'true');
        pup.setAttribute("src", "https://imgbb.com/upload.js");
        pup.setAttribute("data-url", "https://imgbb.com/upload");
        pup.setAttribute("data-auto-insert", "html-embed-medium");
        button?.setAttribute("data-imgbb-trigger", "")
    }
    if (station == 'freeimage') {
        pup.setAttribute("async", 'true');
        pup.setAttribute("src", "https://freeimage.host/sdk/pup.js");
        pup.setAttribute("data-url", "https://freeimage.host/upload");
        pup.setAttribute("data-auto-insert", "html-embed-medium");
        button?.setAttribute("data-chevereto-pup-trigger", "")
    }
    body.appendChild(pup);
}

//删除旧的脚本，避免重复加载
function removeImguploadPlugin() {
    const pupOld = document.getElementById("image-upload-js");
    pupOld?.remove()
}

onMounted(() => {
    setImguploadPlugin(commonStore.userCustom.imgHost)
})

onUnmounted(() => {
    removeImguploadPlugin()
})

//自建图床上传配置
const uploading = ref<boolean>(false)
const customRequest = ({
    file,
    data,
    headers,
    withCredentials,
    action,
    onFinish,
    onError,
    onProgress
}: UploadCustomRequestOptions) => {
    if (file.file !== null) {
        if (file.file.size > 1024000) {
            window.$message.error('图片大小不能超过10M喔')
            NUploadCom.value?.clear() //清空已选择的图片
            return
        }
        const params: uploadImageParams = {
            binggan: userStore.binggan!,
            file: file.file,
            mode: 'img',
            thread_id: props.threadId,
            forum_id: props.forumId
        }
        uploading.value = true
        uploadImagePoster(params)
            .then((response) => {
                emit('insertImage', response.file_url)//插入链接到输入框
                NUploadCom.value?.clear() //清空已选择的图片
                uploading.value = false
            })
            .catch(() => {
                NUploadCom.value?.clear() //清空已选择的图片
                uploading.value = false
            });
    }
}
</script>