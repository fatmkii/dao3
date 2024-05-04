import { ref } from 'vue'

interface browseLogValue {
    [prop: number]: {
        expireTime: number,
        floor: number,
    } | undefined;
}
function useBrowseLogger() {

    class browseLogger {
        _defaultValue = {}
        _logData = ref<browseLogValue>(this._defaultValue)

        constructor() {
            const valueRaw = localStorage.getItem('browseLogger')
            if (!valueRaw) {
                this._logData.value = this._defaultValue
            } else {
                let valueTemp: browseLogValue = JSON.parse(valueRaw)
                for (let key in valueTemp) {
                    //删除过期的记录
                    if (valueTemp[key]!.expireTime < Date.now()) {
                        delete valueTemp[key]
                    }
                }
                this._logData.value = valueTemp
                localStorage.setItem('browseLogger', JSON.stringify(this._logData.value)) //将已经过期的浏览记录删除
            }
        }

        reload() {
            const valueRaw = localStorage.getItem('browseLogger')
            if (valueRaw) {
                this._logData.value = JSON.parse(valueRaw)
            }
        }

        log(threadId: number, floor: number): void {
            const timestamp = new Date().getTime() + 3600 * 24 * 1000 //过期时间为1天
            this._logData.value[threadId] = {
                expireTime: timestamp,
                floor: floor
            }
            localStorage.setItem('browseLogger', JSON.stringify(this._logData.value))
        }

        initThread(threadId: number) {
            if (this.get(threadId) === undefined) {
                this.log(threadId, 0)
            }
        }

        get(threadId: number) {
            return this._logData.value[threadId]
        }

        get data() {
            return this._logData;
        }
    }

    const logger = new browseLogger()
    return logger
}

export { browseLogValue, useBrowseLogger } 