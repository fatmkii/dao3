import { expect, test, type Page, type WebSocketRoute } from '@playwright/test';

interface BridgeMessage {
    type: string;
    payload?: Record<string, unknown>;
}

const forum = {
    id: 1,
    sub_id: 0,
    name: '综合版',
    description: 'test forum',
    status: 1,
    is_anonymous: 0,
    accessible_coin: 0,
    is_nissin: 0,
    banners: [],
    default_heads: 0,
    deleted_at: null,
};

const userData = {
    binggan: {
        admin: 0,
        admin_forums: [],
        nickname: 'android-user',
        coin: 0,
        coin_in_bank: 0,
        use_pingbici: false,
        new_msg: false,
        user_lv: 0,
        locked_ttl: 0,
    },
    my_battle_chara: [],
    pingbici: {
        content_pingbici: [],
        fjf_pingbici: [],
        title_pingbici: [],
    },
    my_emoji: [],
    emoji_excluded: [],
};

async function installAndroidBridge(page: Page, options: {
    storageNamespace?: string;
    binggan?: string;
    accessToken?: string;
    pendingStorageNamespaces?: string[];
    replyToBootstrap?: boolean;
} = {}) {
    await page.addInitScript((bootstrapOptions) => {
        const bridgeWindow = window as Window & {
            __bridgeMessages: BridgeMessage[];
            CpttmmAndroid: {
                postMessage(message: string): void;
                addEventListener(type: string, listener: (event: MessageEvent) => void): void;
                removeEventListener(type: string, listener: (event: MessageEvent) => void): void;
            };
        };
        const listeners = new Set<(event: MessageEvent) => void>();
        bridgeWindow.__bridgeMessages = [];
        bridgeWindow.CpttmmAndroid = {
            addEventListener(_type, listener) {
                listeners.add(listener);
            },
            removeEventListener(_type, listener) {
                listeners.delete(listener);
            },
            postMessage(serialized) {
                const message = JSON.parse(serialized) as BridgeMessage;
                bridgeWindow.__bridgeMessages.push(message);
                if (message.type === 'authBootstrapRequested' &&
                    bootstrapOptions.replyToBootstrap !== false &&
                    localStorage.getItem('__skipBootstrap') !== 'true') {
                    const dispatchBootstrap = () => listeners.forEach((listener) => listener(new MessageEvent('message', {
                        data: JSON.stringify({
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
                        }),
                    })));
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
            },
        };
    }, options);
}

async function mockAuthenticatedUser(page: Page) {
    await page.route('**/api/user/show', (route) => route.fulfill({
        json: { code: 200, message: 'success', data: userData },
    }));
}

async function bridgeMessages(page: Page): Promise<BridgeMessage[]> {
    return page.evaluate(() => (
        window as Window & { __bridgeMessages: BridgeMessage[] }
    ).__bridgeMessages);
}

test.describe('Android App bridge', () => {
    test.beforeEach(async ({ page }) => {
        await installAndroidBridge(page);
    });

    test('hides web authentication controls and synchronizes theme', async ({ page }) => {
        await mockAuthenticatedUser(page);

        await page.goto('/', { waitUntil: 'domcontentloaded' });

        await expect(page.getByRole('button', { name: '导入饼干' })).toBeHidden();
        await expect.poll(() => page.evaluate(() => ({
            token: localStorage.getItem('Token'),
            binggan: localStorage.getItem('Binggan'),
        }))).toEqual({ token: null, binggan: null });
        await expect.poll(async () => {
            const messages = await bridgeMessages(page);
            return messages.find((message) => message.type === 'themeChanged');
        }).toMatchObject({
            type: 'themeChanged',
            payload: {
                name: 'green',
                isDark: false,
            },
        });
    });

    test('waits for bootstrap before the first authenticated request', async ({ page }) => {
        let userRequestCount = 0;
        await page.addInitScript(() => localStorage.setItem('__bootstrapDelayMs', '250'));
        await page.route('**/api/user/show', (route) => {
            userRequestCount += 1;
            return route.fulfill({ json: { code: 200, message: 'success', data: userData } });
        });

        await page.goto('/', { waitUntil: 'domcontentloaded' });
        expect(userRequestCount).toBe(0);
        await expect.poll(() => userRequestCount).toBe(1);
        const messages = await bridgeMessages(page);
        expect(messages[0]).toEqual({ type: 'authBootstrapRequested' });
    });

    test('shows retry UI when bootstrap times out', async ({ page }) => {
        await page.clock.install({ time: new Date('2026-08-04T12:00:00Z') });
        await page.addInitScript(() => localStorage.setItem('__skipBootstrap', 'true'));

        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await page.clock.fastForward(10_001);

        await expect(page.getByRole('heading', { name: '初始化失败' })).toBeVisible();
        await expect(page.getByRole('button', { name: '重试' })).toBeVisible();
    });

    test('isolates tokens and settings between two pages in one browser context', async ({ page, context }) => {
        await page.addInitScript(() => {
            localStorage.setItem('cpttmm:account-one:theme', 'dark');
            localStorage.setItem('cpttmm:account-two:theme', 'green');
        });
        const secondPage = await context.newPage();
        await installAndroidBridge(secondPage, {
            storageNamespace: 'account-two',
            binggan: 'second_binggan',
            accessToken: 'token-two',
        });

        let firstAuthorization = '';
        let secondAuthorization = '';
        await page.route('**/api/user/show', (route) => {
            firstAuthorization = route.request().headers().authorization ?? '';
            return route.fulfill({ json: { code: 200, message: 'success', data: userData } });
        });
        await secondPage.route('**/api/user/show', (route) => {
            secondAuthorization = route.request().headers().authorization ?? '';
            return route.fulfill({ json: { code: 200, message: 'success', data: userData } });
        });

        await Promise.all([
            page.goto('/', { waitUntil: 'domcontentloaded' }),
            secondPage.goto('/', { waitUntil: 'domcontentloaded' }),
        ]);

        await expect.poll(() => firstAuthorization).toBe('Bearer expired-token');
        await expect.poll(() => secondAuthorization).toBe('Bearer token-two');
        await expect.poll(async () => (await bridgeMessages(page))
            .find((message) => message.type === 'themeChanged')?.payload?.name).toBe('dark');
        await expect.poll(async () => (await bridgeMessages(secondPage))
            .find((message) => message.type === 'themeChanged')?.payload?.name).toBe('green');
    });

    test('cleans pending namespaces without touching the active account', async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('cpttmm:removed-account:theme', 'dark');
            localStorage.setItem('cpttmm:account-one:theme', 'green');
            localStorage.setItem('__pendingNamespaces', JSON.stringify(['removed-account']));
        });
        await mockAuthenticatedUser(page);

        await page.goto('/', { waitUntil: 'domcontentloaded' });

        await expect.poll(() => page.evaluate(() => ({
            removed: localStorage.getItem('cpttmm:removed-account:theme'),
            active: localStorage.getItem('cpttmm:account-one:theme'),
        }))).toEqual({ removed: null, active: 'green' });
        const messages = await bridgeMessages(page);
        expect(messages).toContainEqual({
            type: 'storageCleanupCompleted',
            payload: { storageNamespaces: ['removed-account'] },
        });
    });

    test('refreshes once and retries a read request with the new token', async ({ page }) => {
        await mockAuthenticatedUser(page);
        let forumRequestCount = 0;
        const authorizationHeaders: string[] = [];

        await page.route('**/api/forums/**', async (route) => {
            const request = route.request();
            const path = new URL(request.url()).pathname;
            if (path === '/api/forums/') {
                await route.fulfill({ json: { code: 200, message: 'success', data: [forum] } });
                return;
            }
            if (path !== '/api/forums/1') {
                await route.continue();
                return;
            }

            forumRequestCount += 1;
            authorizationHeaders.push(request.headers().authorization ?? '');
            if (forumRequestCount === 1) {
                await route.fulfill({ status: 401, json: { code: 401, message: 'expired' } });
                return;
            }

            await route.fulfill({
                json: {
                    code: 200,
                    message: 'success',
                    data: {
                        forum_data: forum,
                        threads_data: {
                            currentPage: 1,
                            lastPage: 1,
                            data: [{
                                id: 101,
                                sub_id: 0,
                                forum_id: 1,
                                vote_question_id: null,
                                gamble_question_id: null,
                                crowd_id: null,
                                hongbao_id: null,
                                nickname: null,
                                title: '刷新后出现的主题',
                                sub_title: '',
                                random_heads_group: 0,
                                posts_num: 1,
                                title_color: null,
                                anti_jingfen: false,
                                nissin_date: null,
                                has_nissined: false,
                                can_battle: false,
                                is_delay: false,
                                locked_by_coin: 0,
                                is_private: false,
                                created_at: '2026-07-18 12:00:00',
                                updated_at: '2026-07-18 12:00:00',
                            }],
                        },
                        subtitles_exclude: null,
                    },
                },
            });
        });
        await page.route('**/api/loudspeaker/show**', (route) => route.fulfill({
            json: { code: 200, message: 'success', data: [] },
        }));

        await page.goto('/forum/1', { waitUntil: 'domcontentloaded' });

        await expect(page.getByText('刷新后出现的主题')).toBeVisible();
        expect(forumRequestCount).toBe(2);
        expect(authorizationHeaders).toEqual([
            'Bearer expired-token',
            'Bearer refreshed-token',
        ]);
        const messages = await bridgeMessages(page);
        expect(messages.filter((message) => message.type === 'authExpired')).toHaveLength(1);
    });

    test('refreshes once and retries the safe user-data POST with the new token', async ({ page }) => {
        let userDataRequestCount = 0;
        const authorizationHeaders: string[] = [];
        await page.route('**/api/user/show', async (route) => {
            userDataRequestCount += 1;
            authorizationHeaders.push(route.request().headers().authorization ?? '');
            if (userDataRequestCount === 1) {
                await route.fulfill({ status: 401, json: { code: 401, message: 'expired' } });
                return;
            }

            await route.fulfill({
                json: { code: 200, message: 'success', data: userData },
            });
        });

        await page.goto('/', { waitUntil: 'domcontentloaded' });

        await expect.poll(async () => {
            const messages = await bridgeMessages(page);
            return messages.filter((message) => message.type === 'authExpired').length;
        }).toBe(1);
        await expect.poll(() => userDataRequestCount).toBe(2);
        expect(authorizationHeaders).toEqual([
            'Bearer expired-token',
            'Bearer refreshed-token',
        ]);
    });

    test('keeps the web unauthenticated modal hidden when native refresh fails', async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('__androidRefreshFails', 'true');
        });
        await page.route('**/api/user/show', (route) => route.fulfill({
            status: 401,
            json: { code: 401, message: 'expired' },
        }));

        await page.goto('/', { waitUntil: 'domcontentloaded' });

        await expect.poll(async () => {
            const messages = await bridgeMessages(page);
            return messages.filter((message) => message.type === 'authExpired').length;
        }).toBe(1);
        await expect(page.getByAltText('需要饼干才能进入喔')).toBeHidden();
    });

    test('reconciles the current page once when Android returns to foreground', async ({ page }) => {
        await mockAuthenticatedUser(page);
        await page.route('**/api/forums/', (route) => route.fulfill({
            json: { code: 200, message: 'success', data: [forum] },
        }));
        await page.route('**/api/loudspeaker/show**', (route) => route.fulfill({
            json: { code: 200, message: 'success', data: [] },
        }));

        let threadRequestCount = 0;
        let lastPage = 1;
        const threadData = {
            id: 123,
            sub_id: 0,
            forum_id: 1,
            vote_question_id: null,
            gamble_question_id: null,
            crowd_id: null,
            hongbao_id: null,
            nickname: null,
            title: '自动涮锅测试主题',
            sub_title: '',
            random_heads_group: 1,
            posts_num: 1,
            title_color: null,
            anti_jingfen: false,
            nissin_date: null,
            has_nissined: false,
            can_battle: false,
            is_delay: false,
            locked_by_coin: 0,
            is_private: false,
            created_at: '2026-07-27 12:00:00',
            updated_at: '2026-07-27 12:00:00',
        };
        const post = {
            id: 1000,
            created_at: '2026-07-27 12:00:00',
            is_deleted: 0,
            thread_id: 123,
            battle_id: null,
            hongbao_id: null,
            floor: 0,
            random_head: 0,
            created_by_admin: 0,
            content: '当前页内容',
            nickname: '测试用户',
            is_your_post: false,
            hongbao_data: null,
        };
        await page.route('**/api/threads/123**', async (route) => {
            threadRequestCount += 1;
            await route.fulfill({
                json: {
                    code: 200,
                    message: 'success',
                    data: {
                        forum_data: forum,
                        thread_data: threadData,
                        posts_data: { currentPage: 1, lastPage, data: [post] },
                        your_post_floors: [],
                        watermark_string: 'test-watermark',
                    },
                },
            });
        });
        let reverbSocket: WebSocketRoute | undefined;
        let postRequestCount = 0;
        await page.route('**/api/posts/1001**', (route) => {
            postRequestCount += 1;
            return route.fulfill({
                status: 500,
                json: { code: 500, message: 'temporary failure' },
            });
        });
        await page.routeWebSocket(/\/app\//, (webSocket) => {
            reverbSocket = webSocket;
            webSocket.send(JSON.stringify({
                event: 'pusher:connection_established',
                data: JSON.stringify({ socket_id: '1.1', activity_timeout: 120 }),
            }));
            webSocket.onMessage((message) => {
                const event = JSON.parse(String(message));
                if (event.event !== 'pusher:subscribe') return;
                webSocket.send(JSON.stringify({
                    event: 'pusher_internal:subscription_succeeded',
                    channel: event.data.channel,
                    data: '{}',
                }));
            });
        });

        await page.goto('/thread/123/1', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText('自动涮锅测试主题')).toBeVisible();
        const contentInput = page.locator('#content-input');
        await contentInput.evaluate((element) => {
            const textarea = element as HTMLTextAreaElement;
            textarea.getBoundingClientRect = () => ({
                x: 0,
                y: window.innerHeight,
                top: window.innerHeight,
                right: 300,
                bottom: window.innerHeight + 150,
                left: 0,
                width: 300,
                height: 150,
                toJSON: () => ({}),
            });
            textarea.scrollIntoView = () => {
                textarea.dataset.scrolledAfterResize = 'true';
            };
        });
        await contentInput.focus();
        await page.evaluate(() => window.dispatchEvent(new Event('resize')));
        await expect.poll(() => contentInput.getAttribute('data-scrolled-after-resize')).toBe('true');

        const autoRefreshSwitch = page.getByRole('switch');
        await autoRefreshSwitch.click();
        await expect(autoRefreshSwitch).toBeChecked();
        const requestsAfterStart = threadRequestCount;

        reverbSocket?.send(JSON.stringify({
            event: 'NewPost',
            channel: 'thread_123',
            data: JSON.stringify({ post_id: 1001, thread_id: 123, post_floor: 1 }),
        }));
        await expect.poll(() => postRequestCount).toBe(1);
        await expect.poll(() => threadRequestCount).toBe(requestsAfterStart + 1);
        await expect(autoRefreshSwitch).toBeChecked();
        const requestsAfterPostFetchRecovery = threadRequestCount;

        await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
        await page.evaluate(() => new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }));
        expect(threadRequestCount).toBe(requestsAfterPostFetchRecovery);

        lastPage = 3;
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('cpttmm:foreground'));
            window.dispatchEvent(new CustomEvent('cpttmm:foreground'));
        });
        await expect.poll(() => threadRequestCount).toBe(requestsAfterPostFetchRecovery + 1);
        await expect(page.getByRole('link', { name: '回帖已经翻页、点击前往' })).toBeVisible();
        await expect(autoRefreshSwitch).not.toBeChecked();
        await expect(page.getByText('当前页内容')).toBeVisible();
    });

    test('hides custom-account creation in the Android app', async ({ page }) => {
        await mockAuthenticatedUser(page);
        await page.route('**/api/user/show_medals', (route) => route.fulfill({
            json: { code: 200, message: 'success', data: [] },
        }));
        await page.route('**/api/user/show_medal_progress', (route) => route.fulfill({
            json: { code: 200, message: 'success', data: {} },
        }));

        await page.goto('/user-center', { waitUntil: 'domcontentloaded' });
        await expect(page.getByText('定制饼干', { exact: true })).toBeHidden();
    });
});
