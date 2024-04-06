import { commonAlova } from '@/api/index';


interface userLoginData {
    "binggan": string,
    "token": string
}

const userLoginPoster = (binggan: string, password: string) =>
    commonAlova.Post<userLoginData>(
        '/api/login',
        {
            //第二个参数是data
            binggan: binggan,
            password: password
        },
        {
            //第三个参数是config
            name: 'userLoginPoster',
            params: {},
            localCache: null
        }
    )

interface userLogoutData {
    "binggan": string,
}

const userLogoutPoster = (binggan: string) =>
    commonAlova.Post<userLogoutData>(
        '/api/logout',
        {
            //第二个参数是data
            binggan: binggan,
        },
        {
            //第三个参数是config
            name: 'userLogoutPoster',
            params: {},
            localCache: null
        }
    )


interface userSetPasswordParams {
    binggan: string,
    old_password: string,
    new_password: string,
}

const userSetPasswordPoster = (params: userSetPasswordParams) => {
    const methodInstance = commonAlova.Post<null>(
        '/api/set_password',
        params,
        {
            //第三个参数是config
            name: 'userSetPasswordPoster',
            params: {},
            localCache: null
        }
    )
    methodInstance.meta = {
        shouldRemind: true
    };
    return methodInstance
}

export { userLoginPoster, userLogoutPoster, userSetPasswordParams, userSetPasswordPoster };
