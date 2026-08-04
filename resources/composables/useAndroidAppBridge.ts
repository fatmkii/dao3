import { readonly, shallowRef } from 'vue'

export interface AndroidThemePayload {
    name: string
    isDark: boolean
    primaryColor: string
    backgroundColor: string
}

type BridgeMessage =
    | { type: 'themeChanged', payload: AndroidThemePayload }
    | { type: 'oloChanged', payload: { amount: number } }
    | { type: 'authExpired' }

const isAndroidApp = shallowRef(typeof window !== 'undefined' && Boolean(window.CpttmmAndroid))
let pendingRefresh: Promise<void> | null = null
let resolveRefresh: (() => void) | null = null
let rejectRefresh: ((reason: Error) => void) | null = null
let refreshTimeout: number | null = null

function postMessage(message: BridgeMessage): boolean {
    const bridge = window.CpttmmAndroid
    if (!bridge) return false

    bridge.postMessage(JSON.stringify(message))
    return true
}

function settleRefresh(error?: Error) {
    if (refreshTimeout !== null) window.clearTimeout(refreshTimeout)
    if (error) rejectRefresh?.(error)
    else resolveRefresh?.()
    pendingRefresh = null
    resolveRefresh = null
    rejectRefresh = null
    refreshTimeout = null
}

if (typeof window !== 'undefined') {
    window.addEventListener('cpttmm:auth-updated', () => settleRefresh())
    window.addEventListener('cpttmm:auth-refresh-failed', () => {
        settleRefresh(new Error('原生登录状态刷新失败'))
    })
}

export function useAndroidAppBridge() {
    function notifyThemeChanged(payload: AndroidThemePayload) {
        postMessage({ type: 'themeChanged', payload })
    }

    function notifyOloChanged(amount: number) {
        postMessage({ type: 'oloChanged', payload: { amount } })
    }

    function requestAuthRefresh(): Promise<void> {
        if (!isAndroidApp.value) return Promise.reject(new Error('当前不在 Android App 中'))
        if (pendingRefresh) return pendingRefresh

        const refresh = new Promise<void>((resolve, reject) => {
            resolveRefresh = resolve
            rejectRefresh = reject
        })
        pendingRefresh = refresh
        refreshTimeout = window.setTimeout(
            () => settleRefresh(new Error('原生登录状态刷新超时')),
            20_000,
        )
        if (!postMessage({ type: 'authExpired' })) {
            settleRefresh(new Error('Android 原生桥不可用'))
        }
        return refresh
    }

    return {
        isAndroidApp: readonly(isAndroidApp),
        notifyThemeChanged,
        notifyOloChanged,
        requestAuthRefresh,
    }
}
