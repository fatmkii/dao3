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



export { userLoginPoster, userLogoutPoster };
