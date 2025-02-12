<template>
    <!-- 咒岛专用上传图片 -->
    <n-upload v-if="hostType === 0" accept="image/*" :custom-request="selfBuildImgHostRequest" :show-file-list="false"
        :max="1" ref="NUploadCom">
        <f-button style="margin-right: auto;" :disabled="userIsLocked" :loading="uploading">上传图片</f-button>
    </n-upload>
    <!-- 一般上传图片（chevereto框架的） -->
    <f-button v-if="hostType === 1" style="margin-right: auto;" :disabled="userIsLocked" data-target="#content-input"
        id="upload-button">上传图片</f-button>
    <!-- 一般上传图片（另一个框架的） -->
    <n-upload v-if="hostType === 2" accept="image/*" :custom-request="imgHostType2Request" :show-file-list="false"
        :max="1" ref="NUploadCom">
        <f-button style="margin-right: auto;" :disabled="userIsLocked" :loading="uploading">上传图片</f-button>
    </n-upload>
</template>

<script setup lang="ts">
import { useCommonStore, type imgHostType } from '@/stores/common'
import { FButton } from '@custom'
import { NUpload, type UploadCustomRequestOptions } from 'naive-ui'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { uploadImagePoster, type uploadImageParams, type uploadImageToPublicParams, uploadImageToPublicPoster } from '@/api/methods/common'
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

//根据不同图床选择不同的配置方法
const imgHostList1 = ['mjj', 'imgbb', 'freeimage', 'picgo', 'tutu']
const imgHostList2 = ['imge', 'imgtbl', 'imgimg', 'helloimg', 'picui', 'imgwang']
const hostType = computed<number>(() => {
    if (props.forumId === 419) {
        return 0
    }
    if (imgHostList1.includes(commonStore.userCustom.imgHost)) {
        return 1
    }
    if (imgHostList2.includes(commonStore.userCustom.imgHost)) {
        return 2
    }
    return 1
})


//自建图床上传配置
const uploading = ref<boolean>(false)
const selfBuildImgHostRequest = ({
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

//免费图床配置（类型1的，使用chevereto的）
function setImguploadPlugin(station: imgHostType) {
    //手动载入插图插件
    var body = document.getElementsByTagName("body")[0];
    var pup = document.createElement("script");
    pup.setAttribute("id", "image-upload-js");
    var button = document.getElementById('upload-button');
    if (station == 'mjj') {
        pup.setAttribute("async", 'true');
        pup.setAttribute("data-mode", "manual");
        pup.setAttribute("src", "https://mjj.today/sdk/pup.js");
        pup.setAttribute("data-url", "https://mjj.today/upload");
        pup.setAttribute("data-auto-insert", "html-embed");
        button?.setAttribute("data-chevereto-pup-trigger", "")
    }
    if (station == 'imgbb') {
        pup.setAttribute("async", 'true');
        pup.setAttribute("data-mode", "manual");
        pup.setAttribute("src", "https://imgbb.com/upload.js");
        pup.setAttribute("data-url", "https://imgbb.com/upload");
        pup.setAttribute("data-auto-insert", "html-embed-medium");
        button?.setAttribute("data-imgbb-trigger", "")
    }
    if (station == 'freeimage') {
        pup.setAttribute("async", 'true');
        pup.setAttribute("data-mode", "manual");
        pup.setAttribute("src", "https://freeimage.host/sdk/pup.js");
        pup.setAttribute("data-url", "https://freeimage.host/upload");
        pup.setAttribute("data-auto-insert", "html-embed-medium");
        button?.setAttribute("data-chevereto-pup-trigger", "")
    }
    if (station == 'picgo') {
        pup.setAttribute("async", 'true');
        pup.setAttribute("data-mode", "manual");
        pup.setAttribute("src", "https://www.picgo.net/sdk/pup.js");
        pup.setAttribute("data-url", "https://www.picgo.net/upload");
        pup.setAttribute("data-auto-insert", "html-embed");
        button?.setAttribute("data-chevereto-pup-trigger", "")
    }
    //tutu图床它的后台返回url有问题
    // if (station == 'tutu') {
    //     pup.setAttribute("async", 'true');
    //     pup.setAttribute("data-mode", "manual");
    //     pup.setAttribute("src", "https://tutu.to/sdk/pup.js");
    //     pup.setAttribute("data-url", "https://tutu.to/upload");
    //     pup.setAttribute("data-auto-insert", "html-embed");
    //     button?.setAttribute("data-chevereto-pup-trigger", "")
    // }
    body.appendChild(pup);
}

//免费图床配置（类型2的，使用不知道什么框架的）
const imgHostType2Url = computed<string>(() => {
    const urlMap: { [key: string]: string } = {
        'imge': 'https://imge.cc/api/v1/upload',
        'imgtbl': 'https://imgtbl.com/api/v1/upload',
        'imgimg': 'https://imgimg.cc/api/v1/upload',
        'helloimg': 'https://www.helloimg.com/api/v1/upload',
        'picui': 'https://picui.cn/api/v1/upload',
        'imgwang': 'https://img.wang/api/v1/upload',
    }
    return urlMap[commonStore.userCustom.imgHost] || ""

})
const imgHostType2Request = ({
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
        // if (file.file.size > 1024000) {
        //     window.$message.error('图片大小不能超过10M喔')
        //     NUploadCom.value?.clear() //清空已选择的图片
        //     return
        // }
        const params: uploadImageToPublicParams = {
            file: file.file,
            url: imgHostType2Url.value,
        }
        uploading.value = true
        uploadImageToPublicPoster(params)
            .then((response) => {
                console.log(response.data)
                if (response.status === true) {
                    emit('insertImage', response.data.links.url)//插入链接到输入框
                }
                else {
                    window.$message.error(response.message)
                }
                NUploadCom.value?.clear() //清空已选择的图片
                uploading.value = false
            })
            .catch(() => {
                NUploadCom.value?.clear() //清空已选择的图片
                uploading.value = false
            });
    }
}

//删除旧的脚本，避免重复加载
function removeImguploadPlugin() {
    const pupOld = document.getElementById("image-upload-js");
    pupOld?.remove()
}

onMounted(() => {
    if (imgHostList1.includes(commonStore.userCustom.imgHost)) {
        setImguploadPlugin(commonStore.userCustom.imgHost)
    }
})

onUnmounted(() => {
    removeImguploadPlugin()
})

</script>