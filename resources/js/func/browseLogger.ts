import { ref } from 'vue'

interface browseLogValue {
    [prop: number]: {
        expireTime: number,
        floor: number,
    } | undefined;
}
function useBrowseLogger(defaultValue: browseLogValue) {

    class browseLogger {
        _logData = ref<browseLogValue>(defaultValue)

        constructor(defaultValue: browseLogValue) {
            const valueRaw = localStorage.getItem('browseLogger')
            if (!valueRaw) {
                this._logData.value = defaultValue
            } else {
                let valueTemp: browseLogValue = JSON.parse(valueRaw)
                for (let key in valueTemp) {
                    //删除过期的记录
                    if (valueTemp[key]!.expireTime < Date.now()) {
                        delete valueTemp[key]
                    }
                }
                this._logData.value = JSON.parse(valueRaw)
            }
        }

        log(threadId: number, floor: number): void {
            const timestamp = new Date().getTime()
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

    const logger = new browseLogger(defaultValue)
    return logger
}

export { browseLogValue, useBrowseLogger } 