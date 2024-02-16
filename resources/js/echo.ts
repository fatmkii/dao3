import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

class echoInstance {

    _echoConnector: Echo | null

    constructor() {
        this._echoConnector = null
    }

    connect() {
        if (this._echoConnector === null) {
            this._echoConnector = new Echo({
                broadcaster: 'pusher',
                key: import.meta.env.VITE_PUSHER_APP_KEY,
                cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
                wsHost: import.meta.env.VITE_PUSHER_HOST,
                wsPort: import.meta.env.VITE_PUSHER_PORT,
                wssPort: import.meta.env.VITE_PUSHER_PORT,
                forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
                enabledTransports: ['ws', 'wss'],
                namespace: '', //命名空间设置为''，使前端echo监听直接监听纯事件名
            });
        } else {
            throw new Error('Echo实例已经连接过了')
        }
    }

    disconnect() {
        if ((this._echoConnector instanceof Echo)) {
            this._echoConnector.disconnect()
            this._echoConnector = null
        } else {
            throw new Error('Echo实例已经删除过了')
        }
    }

    channel(channel: string) {
        if (this._echoConnector instanceof Echo) {
            return this._echoConnector.channel(channel)
        } else {
            throw new Error('Echo实例需要先连接.connect()')
        }
    }

    leaveChannel(channel: string) {
        if (this._echoConnector instanceof Echo) {
            this._echoConnector.leaveChannel(channel)
        } else {
            throw new Error('Echo实例需要先连接.connect()')
        }
    }

    leaveAllChannels() {
        if (this._echoConnector instanceof Echo) {
            this._echoConnector.leaveAllChannels()
        } else {
            throw new Error('Echo实例需要先连接.connect()')
        }
    }

    get isConnected() {
        if (this._echoConnector instanceof Echo) {
            return true
        } else {
            return false
        }
    }

    get pusher() {
        if (this._echoConnector instanceof Echo) {
            return this._echoConnector.connector.pusher as Pusher
        } else {
            return null
        }
    }
}


function useEcho() {
    const echo = new echoInstance()
    return echo
}

export { useEcho }