import { expect, test, type Page } from '@playwright/test';

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

async function installAndroidBridge(page: Page) {
    await page.addInitScript(() => {
        localStorage.setItem('Binggan', 'android_binggan');
        localStorage.setItem('Token', 'expired-token');

        const bridgeWindow = window as Window & {
            __bridgeMessages: BridgeMessage[];
            CpttmmAndroid: { postMessage(message: string): void };
        };
        bridgeWindow.__bridgeMessages = [];
        bridgeWindow.CpttmmAndroid = {
            postMessage(serialized) {
                const message = JSON.parse(serialized) as BridgeMessage;
                bridgeWindow.__bridgeMessages.push(message);
                if (message.type === 'authExpired') {
                    if (localStorage.getItem('__androidRefreshFails') === 'true') {
                        window.dispatchEvent(new CustomEvent('cpttmm:auth-refresh-failed'));
                    } else {
                        localStorage.setItem('Token', 'refreshed-token');
                        window.dispatchEvent(new CustomEvent('cpttmm:auth-updated'));
                    }
                }
            },
        };
    });
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

    test('requests refresh but never replays a write request', async ({ page }) => {
        let writeRequestCount = 0;
        await page.route('**/api/user/show', async (route) => {
            writeRequestCount += 1;
            await route.fulfill({ status: 401, json: { code: 401, message: 'expired' } });
        });

        await page.goto('/', { waitUntil: 'domcontentloaded' });

        await expect.poll(async () => {
            const messages = await bridgeMessages(page);
            return messages.filter((message) => message.type === 'authExpired').length;
        }).toBe(1);
        expect(writeRequestCount).toBe(1);
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
