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
            // const wsHost = import.meta.env.VITE_REVERB_HOST_SUBDOMAIN + window.location.hostname;
            const wsHost = window.location.hostname;
            this._echoConnector = new Echo({
                broadcaster: 'reverb',
                key: import.meta.env.VITE_REVERB_APP_KEY,
                wsHost: wsHost,
                wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
                wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
                forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
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