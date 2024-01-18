import { MessageApi } from 'naive-ui'

//用于window.$message挂载的类型声明（ts好烦！)

declare global {
    interface Window {
        $message: MessageApi
    }
}
export { }