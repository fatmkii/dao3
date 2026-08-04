<script setup lang="ts">
import { uploadImagePoster, type uploadImageParams, uploadImageToPublicPoster, type uploadImageToPublicParams } from '@/api/methods/common'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { FButton } from '@custom'
import { NUpload, type UploadCustomRequestOptions } from 'naive-ui'
import { computed, shallowRef, useTemplateRef } from 'vue'

interface Props {
    userIsLocked: boolean
    forumId: number
    threadId: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
    insertImage: [imgSrc: string]
}>()

const commonStore = useCommonStore()
const userStore = useUserStore()
const upload = useTemplateRef<InstanceType<typeof NUpload>>('upload')
const uploading = shallowRef(false)
const publicHostUrl = computed(() => commonStore.userCustom.imgHostAndroid === 'imgimg'
    ? 'https://imgimg.cc/api/v1/upload'
    : 'https://picui.cn/api/v1/upload')

async function uploadImage({ file }: UploadCustomRequestOptions) {
    if (file.file === null) return
    if (props.forumId === 419 && file.file.size > 1024000) {
        window.$message.error('图片大小不能超过10M喔')
        upload.value?.clear()
        return
    }

    uploading.value = true
    try {
        if (props.forumId === 419) {
            const params: uploadImageParams = {
                binggan: userStore.binggan!,
                file: file.file,
                mode: 'img',
                thread_id: props.threadId,
                forum_id: props.forumId,
            }
            const response = await uploadImagePoster(params)
            emit('insertImage', response.file_url)
            return
        }

        const params: uploadImageToPublicParams = {
            file: file.file,
            url: publicHostUrl.value,
        }
        const response = await uploadImageToPublicPoster(params)
        if (response.status === true) {
            emit('insertImage', response.data.links.url)
        } else {
            window.$message.error(response.message)
        }
    } finally {
        upload.value?.clear()
        uploading.value = false
    }
}
</script>

<template>
    <n-upload ref="upload" accept="image/*" :custom-request="uploadImage" :show-file-list="false" :max="1">
        <f-button style="margin-right: auto;" :disabled="userIsLocked" :loading="uploading">上传图片</f-button>
    </n-upload>
</template>
