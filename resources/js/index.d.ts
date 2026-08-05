import type Pusher from 'pusher-js'
import { DialogApi } from 'naive-ui'
import { MessageApi } from 'naive-ui'

//用于window.* 挂载的类型声明（ts好烦！)
declare global {
    interface Window {
        Pusher: typeof Pusher
        $dialog: DialogApi
        $message: MessageApi
        CpttmmAndroid?: {
            postMessage(message: string): void
            addEventListener?(type: 'message', listener: (event: MessageEvent) => void): void
            removeEventListener?(type: 'message', listener: (event: MessageEvent) => void): void
        }
    }
}
