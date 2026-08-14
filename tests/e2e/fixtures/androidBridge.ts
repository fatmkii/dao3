import { type Page } from '@playwright/test';

const ANDROID_BRIDGE_READY_ACK = 'cpttmm:bridge-ready-v1';

export interface BridgeMessage {
    type: string;
    payload?: Record<string, unknown>;
}

export interface AndroidBridgeOptions {
    storageNamespace?: string;
    binggan?: string;
    accessToken?: string;
    pendingStorageNamespaces?: string[];
    replyToBootstrap?: boolean;
    themeName?: string;
}

async function installBridge(
    page: Page,
    options: AndroidBridgeOptions = {},
) {
    await page.addInitScript(({ bootstrapOptions, bridgeReadyAck }) => {
        const bridgeWindow = window as Window & {
            __bridgeAcknowledged: boolean;
            __bridgeMessages: BridgeMessage[];
            __dispatchNativeBridgeMessage?: (message: string) => void;
        };
        bridgeWindow.__bridgeAcknowledged = false;
        bridgeWindow.__bridgeMessages = [];

        const handleOutgoing = (
            serialized: string,
            dispatchToWeb: (message: string) => void,
        ) => {
            if (serialized === bridgeReadyAck) {
                bridgeWindow.__bridgeAcknowledged = true;
                return;
            }
            const message = JSON.parse(serialized) as BridgeMessage;
            bridgeWindow.__bridgeMessages.push(message);
            if (message.type === 'authBootstrapRequested' &&
                bootstrapOptions.replyToBootstrap !== false &&
                localStorage.getItem('__skipBootstrap') !== 'true') {
                const dispatchBootstrap = () => dispatchToWeb(JSON.stringify({
                    type: 'authBootstrap',
                    payload: {
                        storageNamespace: bootstrapOptions.storageNamespace ?? 'account-one',
                        binggan: bootstrapOptions.binggan ?? 'android_binggan',
                        accessToken: bootstrapOptions.accessToken ?? 'expired-token',
                        pendingStorageNamespaces: JSON.parse(
                            localStorage.getItem('__pendingNamespaces') ??
                            JSON.stringify(bootstrapOptions.pendingStorageNamespaces ?? []),
                        ),
                        themeName: bootstrapOptions.themeName ?? 'green',
                    },
                }));
                const delay = Number(localStorage.getItem('__bootstrapDelayMs') ?? 0);
                if (delay > 0) window.setTimeout(dispatchBootstrap, delay);
                else queueMicrotask(dispatchBootstrap);
            }
            if (message.type === 'authExpired') {
                if (localStorage.getItem('__androidRefreshFails') === 'true') {
                    window.dispatchEvent(new CustomEvent('cpttmm:auth-refresh-failed'));
                } else {
                    window.dispatchEvent(new CustomEvent('cpttmm:auth-updated', {
                        detail: { accessToken: 'refreshed-token' },
                    }));
                }
            }
        };

        Object.defineProperty(navigator, 'userAgent', {
            configurable: true,
            value: `${navigator.userAgent} CpttmmAndroid`,
        });
        window.addEventListener('DOMContentLoaded', () => {
            const channel = new MessageChannel();
            channel.port1.onmessage = (event) => {
                handleOutgoing(String(event.data), (message) => channel.port1.postMessage(message));
            };
            channel.port1.start();
            bridgeWindow.__dispatchNativeBridgeMessage = (message) => {
                channel.port1.postMessage(message);
            };
            window.dispatchEvent(new MessageEvent('message', {
                data: 'cpttmm:bridge-port-v1',
                ports: [channel.port2],
            }));
        }, { once: true });
    }, {
        bootstrapOptions: options,
        bridgeReadyAck: ANDROID_BRIDGE_READY_ACK,
    });
}

export async function installMessagePortAndroidBridge(page: Page, options: AndroidBridgeOptions = {}) {
    await installBridge(page, options);
}

export async function bridgeMessages(page: Page): Promise<BridgeMessage[]> {
    return page.evaluate(() => (
        window as Window & { __bridgeMessages: BridgeMessage[] }
    ).__bridgeMessages);
}

export async function bridgeAcknowledged(page: Page): Promise<boolean> {
    return page.evaluate(() => (
        window as Window & { __bridgeAcknowledged: boolean }
    ).__bridgeAcknowledged);
}

export async function dispatchNativeTheme(page: Page, name: string) {
    await page.evaluate((themeName) => {
        const bridgeWindow = window as Window & {
            __dispatchNativeBridgeMessage?: (message: string) => void;
        };
        bridgeWindow.__dispatchNativeBridgeMessage?.(JSON.stringify({
            type: 'themeSelected',
            payload: { name: themeName },
        }));
    }, name);
}
