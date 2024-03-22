import { commonAlova } from '@/api/index';

//获取验证码图
interface captchaData {
    captcha_key: string,
    captcha_img: string,
}
const captchaGetter = () => {
    const methodInstance = commonAlova.Get<captchaData>(
        'api/captcha',
        {
            //第三个参数是config
            name: 'postGetter',
            params: {},
            localCache: null,
            hitSource: [],
        }
    )
    methodInstance.meta = {
        shouldRemind: false
    };
    return methodInstance
}

//上传图片
interface uploadImageParams {
    binggan: string,
    file: File,
    mode: 'draw' | 'img',
    thread_id: number,
    forum_id: number
}
const uploadImagePoster = (params: uploadImageParams) => {
    const formData = new FormData
    formData.append("file", params.file)
    formData.append("mode", params.mode)
    formData.append("binggan", params.binggan)
    formData.append("thread_id", String(params.thread_id))
    formData.append("forum_id", String(params.forum_id))
    const methodInstance = commonAlova.Post<{ file_url: string }>(
        'api/img_upload',
        formData,
        {
            //第三个参数是config
            name: 'uploadImagePoster',
            params: {},
            localCache: null,
            hitSource: [],
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}


export { captchaGetter, captchaData, uploadImagePoster, uploadImageParams }