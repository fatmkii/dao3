import { commonAlova, externalAlova } from '@/api/index';

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

//上传图片到自有图床
interface uploadImageParams {
    binggan: string,
    file: File | Blob,
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

//上传图片到免费图床（IMGE/FREEIMG等框架的）
interface uploadImageToPublicParams {
    file: File,
    url: string,
}
interface uploadImageToPublicData {
    status: number | boolean,
    message: string,
    data: {
        key: string,
        name: string,
        pathname: string,
        origin_name: string,
        size: number,
        mimetype: string,
        extension: string,
        md5: string,
        sha1: string,
        links: {
            url: string,
            html: string,
            bbcode: string,
            markdown: string,
            markdown_with_link: string,
            thumbnail_url: string,
            delete_url: string,
        }
    }
}
const uploadImageToPublicPoster = (params: uploadImageToPublicParams) => {
    const formData = new FormData
    formData.append("file", params.file)
    const methodInstance = externalAlova.Post<uploadImageToPublicData>(
        params.url,
        formData,
        {
            //第三个参数是config
            name: 'uploadImageToPublicPoster',
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

//确认是否开放饼干和下次开放日期
interface newBingganCheckData {
    enable: boolean,
    next_date: number, //是个timestamp
}
const newBingganCheckGetter = () => {
    const methodInstance = commonAlova.Get<newBingganCheckData>(
        'api/new_binggan_check',
        {
            //第三个参数是config
            name: 'newBingganCheckGetter',
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


export { captchaGetter, captchaData, uploadImagePoster, uploadImageParams, uploadImageToPublicParams, uploadImageToPublicPoster, newBingganCheckData, newBingganCheckGetter }