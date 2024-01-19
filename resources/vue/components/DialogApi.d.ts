import { DialogApi } from 'naive-ui'

//用于window.$message挂载的类型声明（ts好烦！)

declare global {
    interface Window {
        $dialog: DialogApi
    }
}
export { }