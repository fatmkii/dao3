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


export { captchaGetter, captchaData }