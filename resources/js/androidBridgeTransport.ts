export interface AndroidBridgeTransport {
    postMessage(message: string): void
    addEventListener?(type: 'message', listener: (event: MessageEvent) => void): void
    removeEventListener?(type: 'message', listener: (event: MessageEvent) => void): void
}

export const ANDROID_BRIDGE_HANDSHAKE = 'cpttmm:bridge-port-v1'
export const ANDROID_USER_AGENT_MARKER = 'CpttmmAndroid'

let messagePortTransport: AndroidBridgeTransport | null = null
let resolveMessagePort: ((transport: AndroidBridgeTransport) => void) | null = null

const messagePortReady = typeof window === 'undefined'
    ? null
    : new Promise<AndroidBridgeTransport>((resolve) => {
        resolveMessagePort = resolve
    })

function legacyBridge(): AndroidBridgeTransport | undefined {
    return typeof window !== 'undefined' ? window.CpttmmAndroid : undefined
}

function hasAndroidUserAgent(): boolean {
    return typeof navigator !== 'undefined' &&
        navigator.userAgent.split(/\s+/).includes(ANDROID_USER_AGENT_MARKER)
}

if (typeof window !== 'undefined') {
    window.addEventListener('message', (event) => {
        if (!hasAndroidUserAgent() ||
            event.data !== ANDROID_BRIDGE_HANDSHAKE ||
            event.ports.length !== 1 ||
            messagePortTransport !== null
        ) {
            return
        }

        const port = event.ports[0]
        port.start()
        messagePortTransport = port
        resolveMessagePort?.(port)
        resolveMessagePort = null
    })
}

export function isAndroidApp(): boolean {
    return Boolean(legacyBridge()) || hasAndroidUserAgent()
}

export function currentAndroidBridge(): AndroidBridgeTransport | undefined {
    return legacyBridge() ?? messagePortTransport ?? undefined
}

export async function waitForAndroidBridge(): Promise<AndroidBridgeTransport | undefined> {
    const legacy = legacyBridge()
    if (legacy) return legacy
    if (!hasAndroidUserAgent()) return undefined
    return messagePortTransport ?? messagePortReady ?? undefined
}
