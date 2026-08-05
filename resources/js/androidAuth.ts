interface AndroidAuthBootstrap {
    storageNamespace: string
    binggan: string
    accessToken: string
    pendingStorageNamespaces?: string[]
}

interface NativeBridgeMessage {
    type: string
    payload?: AndroidAuthBootstrap
}

const STORAGE_PREFIX = 'cpttmm:'
const BOOTSTRAP_TIMEOUT_MS = 10_000

let androidAuth: AndroidAuthBootstrap | null = null

function bridge() {
    return typeof window !== 'undefined' ? window.CpttmmAndroid : undefined
}

export function isAndroidApp(): boolean {
    return Boolean(bridge())
}

export function getAccessToken(): string | null {
    return androidAuth?.accessToken ?? localStorage.getItem('Token')
}

export function getBinggan(): string | null {
    return androidAuth?.binggan ?? localStorage.getItem('Binggan')
}

export function updateAndroidAccessToken(accessToken: string) {
    if (androidAuth) androidAuth.accessToken = accessToken
}

function namespacePrefix(namespace: string) {
    return `${STORAGE_PREFIX}${namespace}:`
}

function removeNamespace(namespace: string) {
    const prefix = namespacePrefix(namespace)
    const keys: string[] = []
    for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index)
        if (key?.startsWith(prefix)) keys.push(key)
    }
    keys.forEach((key) => localStorage.removeItem(key))
}

function scopedKey(key: string) {
    return androidAuth ? `${namespacePrefix(androidAuth.storageNamespace)}${key}` : key
}

class ScopedLocalStorage implements Storage {
    get length(): number {
        if (!androidAuth) return localStorage.length
        const prefix = namespacePrefix(androidAuth.storageNamespace)
        let count = 0
        for (let index = 0; index < localStorage.length; index += 1) {
            if (localStorage.key(index)?.startsWith(prefix)) count += 1
        }
        return count
    }

    clear(): void {
        if (!androidAuth) {
            localStorage.clear()
            return
        }
        removeNamespace(androidAuth.storageNamespace)
    }

    getItem(key: string): string | null {
        return localStorage.getItem(scopedKey(key))
    }

    key(index: number): string | null {
        if (!androidAuth) return localStorage.key(index)
        const prefix = namespacePrefix(androidAuth.storageNamespace)
        const keys: string[] = []
        for (let storageIndex = 0; storageIndex < localStorage.length; storageIndex += 1) {
            const key = localStorage.key(storageIndex)
            if (key?.startsWith(prefix)) keys.push(key.slice(prefix.length))
        }
        return keys[index] ?? null
    }

    removeItem(key: string): void {
        localStorage.removeItem(scopedKey(key))
    }

    setItem(key: string, value: string): void {
        localStorage.setItem(scopedKey(key), value)
    }
}

const scopedLocalStorage = new ScopedLocalStorage()

export function getScopedLocalStorage(): Storage {
    return scopedLocalStorage
}

export function initializeAndroidAuth(): Promise<void> {
    const nativeBridge = bridge()
    if (!nativeBridge) return Promise.resolve()

    return new Promise((resolve, reject) => {
        const timeout = window.setTimeout(() => {
            nativeBridge.removeEventListener?.('message', handleMessage)
            reject(new Error('Android 登录信息初始化超时'))
        }, BOOTSTRAP_TIMEOUT_MS)

        function handleMessage(event: MessageEvent) {
            const message = typeof event.data === 'string'
                ? JSON.parse(event.data) as NativeBridgeMessage
                : event.data as NativeBridgeMessage
            if (message.type !== 'authBootstrap' || !message.payload) return

            window.clearTimeout(timeout)
            nativeBridge.removeEventListener?.('message', handleMessage)
            androidAuth = message.payload

            const cleaned = message.payload.pendingStorageNamespaces ?? []
            cleaned.forEach(removeNamespace)
            if (cleaned.length > 0) {
                nativeBridge.postMessage(JSON.stringify({
                    type: 'storageCleanupCompleted',
                    payload: { storageNamespaces: cleaned },
                }))
            }
            resolve()
        }

        nativeBridge.addEventListener?.('message', handleMessage)
        nativeBridge.postMessage(JSON.stringify({ type: 'authBootstrapRequested' }))
    })
}
