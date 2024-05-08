import { createAlova } from 'alova';
import GlobalFetch from 'alova/GlobalFetch';
import VueHook from 'alova/vue';
import { useCommonStore } from '@/stores/common';

//通用的alova实例
export const commonAlova = createAlova({
    statesHook: VueHook,
    requestAdapter: GlobalFetch(),
    beforeRequest: (method) => {
        method.config.headers.Accept = 'application/json';
        const token = localStorage.getItem('Token')
        if (token) {
            method.config.headers.Authorization = 'Bearer ' + token
        }
    },
    responded: {
        // 请求成功的拦截器
        // 当使用GlobalFetch请求适配器时，第一个参数接收Response对象
        // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
        onSuccess: async (response, method) => {
            const commonStore = useCommonStore()
            if (response.status >= 400) {
                commonStore.requestErrorCode = response.status

                if (response.status == 401) {
                    commonStore.unauthModalShow = true //弹出饼干需要重新导入的modal
                    throw new Error(response.statusText, { cause: { code: response.status } });
                }

                const json = await response.json();
                if (json.message) {
                    window.$message.error(JSON.stringify(json.message), { closable: true, duration: 5000 }) //json.message有时候是数组，所以需要转为字符串（例如输入验证错误时）
                    throw new Error(json.message, { cause: { code: json.code } });
                } else {
                    window.$message.error(response.statusText, { closable: true, duration: 5000 })
                    throw new Error(response.statusText, { cause: { code: json.code } });
                }
            }

            const json = await response.json();

            if (json.code !== 200) { // 抛出错误或返回reject状态的Promise实例时，此请求将抛出错误

                commonStore.requestErrorCode = json.code

                if (json.code == 21499) {
                    commonStore.unauthModalShow = true //弹出饼干需要重新导入的modal
                    throw new Error(json.message, { cause: { code: json.code } });
                }

                window.$message.error(JSON.stringify(json.message), { closable: true, duration: 5000 })//json.message有时候是数组，所以需要转为字符串（例如输入验证错误时）
                throw new Error(json.message, { cause: { code: json.code } });
            }

            if (method.meta?.shouldRemind && !commonStore.userCustom.lessToast) {
                //在method中写入meta.shoudRemind，使请求成功后弹出提示
                window.$message.success(json.message)
            }

            return json.data;
        },

        // 请求失败的拦截器
        // 请求错误时将会进入该拦截器。
        // 第二个参数为当前请求的method实例，你可以用它同步请求前后的配置信息
        onError: (error, method) => {
            window.$message.error('嗷！好像网络出错了。')
            throw error
        },

        // 请求完成的拦截器
        // 当你需要在请求不论是成功、失败、还是命中缓存都需要执行的逻辑时，可以在创建alova实例时指定全局的`onComplete`拦截器，例如关闭请求 loading 状态。
        // 接收当前请求的method实例
        onComplete: async method => {
            // 处理请求完成逻辑
        }
    },
    errorLogger: process.env.NODE_ENV === 'development',
    cacheLogger: process.env.NODE_ENV === 'development'
});


//非json数据的alova实例
export const nonJsonAlova = createAlova({
    statesHook: VueHook,
    requestAdapter: GlobalFetch(),
    beforeRequest: (method) => {
    },
    responded: {
        onSuccess: async (response, method) => {
            if (response.status >= 400) {
                throw new Error(response.statusText);
            }
            return response;
        },

        onError: (error, method) => {

        },
        onComplete: async method => {
            // 处理请求完成逻辑
        }
    },
    errorLogger: process.env.NODE_ENV === 'development',
    cacheLogger: process.env.NODE_ENV === 'development'
});


