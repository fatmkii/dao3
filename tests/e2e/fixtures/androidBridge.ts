import { test as base, type Page } from '@playwright/test';

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
}

async function installBridge(
    page: Page,
    transport: 'message-port' | 'legacy-listener',
    options: AndroidBridgeOptions = {},
) {
    await page.addInitScript(({ bootstrapOptions, bridgeTransport, bridgeReadyAck }) => {
        const bridgeWindow = window as Window & {
            __bridgeAcknowledged: boolean;
            __bridgeMessages: BridgeMessage[];
            CpttmmAndroid?: {
                postMessage(message: string): void;
                addEventListener(type: string, listener: (event: MessageEvent) => void): void;
                removeEventListener(type: string, listener: (event: MessageEvent) => void): void;
            };
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

        if (bridgeTransport === 'legacy-listener') {
            const listeners = new Set<(event: MessageEvent) => void>();
            bridgeWindow.CpttmmAndroid = {
                addEventListener(_type, listener) { listeners.add(listener); },
                removeEventListener(_type, listener) { listeners.delete(listener); },
                postMessage(serialized) {
                    handleOutgoing(serialized, (message) => {
                        listeners.forEach((listener) => listener(new MessageEvent('message', {
                            data: message,
                        })));
                    });
                },
            };
            return;
        }

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
            window.dispatchEvent(new MessageEvent('message', {
                data: 'cpttmm:bridge-port-v1',
                ports: [channel.port2],
            }));
        }, { once: true });
    }, {
        bootstrapOptions: options,
        bridgeTransport: transport,
        bridgeReadyAck: ANDROID_BRIDGE_READY_ACK,
    });
}

export async function installMessagePortAndroidBridge(page: Page, options: AndroidBridgeOptions = {}) {
    await installBridge(page, 'message-port', options);
}

export async function installLegacyAndroidBridge(page: Page, options: AndroidBridgeOptions = {}) {
    await installBridge(page, 'legacy-listener', options);
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

export const legacyAndroidTest = base.extend<{ legacyAndroidPage: Page }>({
    legacyAndroidPage: async ({ page }, use) => {
        await installLegacyAndroidBridge(page);
        await use(page);
    },
});
