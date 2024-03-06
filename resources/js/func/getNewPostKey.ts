import * as CryptoJS from 'crypto-js'

export default function getNewPostKey(ist: boolean, threadId: number, binggan: string) {
    const timestamp = new Date().getTime();
    const newPostKey = CryptoJS.MD5(
        threadId + binggan + timestamp + ist
    ).toString()
    return { timestamp, newPostKey }
}

