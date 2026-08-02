import { expect, test } from '@playwright/test';

function versionOnlyUserData(nickname: string, version: string | null, userLevel = 0) {
    return {
        code: 200,
        message: 'success',
        data: {
            binggan: {
                nickname,
                coin: 0,
                coin_in_bank: 0,
                use_pingbici: false,
                new_msg: false,
                user_lv: userLevel,
                locked_ttl: 0,
            },
            my_battle_chara: [],
            pingbici: {
                content_pingbici: [],
                fjf_pingbici: [],
                title_pingbici: [],
            },
            my_emoji_version: version,
            emoji_excluded: [],
        },
    };
}

test('home page renders without browser errors', async ({ page }) => {
    const browserErrors: string[] = [];

    page.on('console', (message) => {
        if (message.type() === 'error') {
            browserErrors.push(message.text());
        }
    });

    page.on('pageerror', (error) => {
        browserErrors.push(error.message);
    });

    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });

    expect(response?.ok()).toBe(true);
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.locator('#app')).not.toHaveText('');
    await expect(page.locator('#app').getByRole('button', { name: '导入饼干' })).toBeVisible();
    expect(await page.evaluate(() => ({
        hasBridge: 'CpttmmAndroid' in window,
        hasBridgeMessages: '__bridgeMessages' in window,
    }))).toEqual({
        hasBridge: false,
        hasBridgeMessages: false,
    });
    expect(browserErrors).toEqual([]);
});

test('uses the account-scoped my emoji cache when the version matches', async ({ page }) => {
    let myEmojiRequestCount = 0;

    await page.addInitScript(() => {
        localStorage.setItem('Binggan', 'cached_binggan');
        localStorage.setItem('Token', 'test-token');
        localStorage.setItem('userMyEmoji:cached_binggan', JSON.stringify({
            version: 'version-1',
            emojis: ['https://example.com/cached.png'],
        }));
    });

    await page.route('**/api/user/show', async (route) => {
        expect(route.request().postDataJSON()).toMatchObject({
            binggan: 'cached_binggan',
            my_emoji_version_only: true,
        });
        await route.fulfill({
            json: versionOnlyUserData('cached-user', 'version-1', 7),
        });
    });
    await page.route('**/api/user/my_emoji', async (route) => {
        myEmojiRequestCount += 1;
        await route.fulfill({
            json: {
                code: 200,
                message: 'success',
                data: {
                    my_emoji_version: 'version-1',
                    my_emoji: ['https://example.com/server.png'],
                },
            },
        });
    });
    await page.route('**/api/user/show_medals', async (route) => {
        await route.fulfill({
            json: { code: 200, message: 'success', data: [] },
        });
    });

    await page.goto('/user-center', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('7', { exact: true })).toBeVisible();
    await page.getByText('表情包', { exact: true }).click();
    await expect(page.locator('img[src="https://example.com/cached.png"]')).toBeVisible();
    expect(myEmojiRequestCount).toBe(0);
    await expect.poll(() => page.evaluate(() => (
        JSON.parse(localStorage.getItem('userMyEmoji:cached_binggan') ?? 'null')
    ))).toEqual({
        version: 'version-1',
        emojis: ['https://example.com/cached.png'],
    });
});

test('downloads and stores my emoji when the cached version is stale', async ({ page }) => {
    let myEmojiRequestCount = 0;

    await page.addInitScript(() => {
        localStorage.setItem('Binggan', 'stale_binggan');
        localStorage.setItem('Token', 'test-token');
        localStorage.setItem('userMyEmoji:stale_binggan', JSON.stringify({
            version: 'version-1',
            emojis: ['https://example.com/stale.png'],
        }));
    });

    await page.route('**/api/user/show', async (route) => {
        await route.fulfill({
            json: versionOnlyUserData('stale-user', 'version-2'),
        });
    });
    await page.route('**/api/user/my_emoji', async (route) => {
        myEmojiRequestCount += 1;
        await route.fulfill({
            json: {
                code: 200,
                message: 'success',
                data: {
                    my_emoji_version: 'version-2',
                    my_emoji: ['https://example.com/current.png'],
                },
            },
        });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect.poll(() => myEmojiRequestCount).toBe(1);
    await expect.poll(() => page.evaluate(() => (
        JSON.parse(localStorage.getItem('userMyEmoji:stale_binggan') ?? 'null')
    ))).toEqual({
        version: 'version-2',
        emojis: ['https://example.com/current.png'],
    });
});

test('rebuilds a malformed my emoji cache without touching another account', async ({ page }) => {
    let myEmojiRequestCount = 0;

    await page.addInitScript(() => {
        localStorage.setItem('Binggan', 'current_binggan');
        localStorage.setItem('Token', 'test-token');
        localStorage.setItem('userMyEmoji:current_binggan', '{malformed');
        localStorage.setItem('userMyEmoji:other_binggan', JSON.stringify({
            version: 'other-version',
            emojis: ['https://example.com/other.png'],
        }));
    });

    await page.route('**/api/user/show', async (route) => {
        await route.fulfill({
            json: versionOnlyUserData('current-user', 'current-version'),
        });
    });
    await page.route('**/api/user/my_emoji', async (route) => {
        myEmojiRequestCount += 1;
        await route.fulfill({
            json: {
                code: 200,
                message: 'success',
                data: {
                    my_emoji_version: 'current-version',
                    my_emoji: ['https://example.com/current.png'],
                },
            },
        });
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect.poll(() => myEmojiRequestCount).toBe(1);
    await expect.poll(() => page.evaluate(() => ({
        current: JSON.parse(localStorage.getItem('userMyEmoji:current_binggan') ?? 'null'),
        other: JSON.parse(localStorage.getItem('userMyEmoji:other_binggan') ?? 'null'),
    }))).toEqual({
        current: {
            version: 'current-version',
            emojis: ['https://example.com/current.png'],
        },
        other: {
            version: 'other-version',
            emojis: ['https://example.com/other.png'],
        },
    });
});

test('accuse demo renders and supports core interactions', async ({ page }) => {
    const browserErrors: string[] = [];
    const accuseItem = {
        id: 104,
        thread_id: 181261,
        post_id: 952741,
        forum_id: 1,
        floor: 233,
        thread_title: '祝福池活动集中帖',
        status: 'pending',
        created_at: '2026-05-29 14:26:18',
        target_recent_count: 3,
        target_deleted_post_penalty_count: 2,
        handled_by: null,
        handled_at: null,
        handle_action: null,
        handle_note: null,
        handle_reduce_olo: false,
        uncertain: true,
        can_manage: true,
        reasons: [
            {
                id: 1,
                content: '连续刷屏影响阅读，希望管理员确认一下。',
                created_at: '2026-05-29 14:26:18',
                reporter_recent_count: 2,
            },
        ],
    };
    const handledAccuseItem = {
        ...accuseItem,
        id: 105,
        post_id: 952742,
        floor: 234,
        status: 'handled',
        handled_by: '测试管理员',
        handled_at: '2026-05-29 15:26:18',
        handle_action: 'delete',
        handle_note: '违反规则删除',
        uncertain: false,
    };

    page.on('console', (message) => {
        if (message.type() === 'error') {
            browserErrors.push(message.text());
        }
    });

    page.on('pageerror', (error) => {
        browserErrors.push(error.message);
    });

    await page.addInitScript(() => {
        localStorage.setItem('Binggan', 'admin_binggan');
        localStorage.setItem('Token', 'test-token');
    });

    await page.route('**/api/user/show', async (route) => {
        await route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify({
                code: 200,
                message: 'success',
                data: {
                    binggan: {
                        admin: 10,
                        admin_forums: [1],
                        nickname: 'admin',
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
                },
            }),
        });
    });

    await page.route('**/api/accuses**', async (route) => {
        const request = route.request();
        const url = new URL(request.url());

        if (request.method() === 'GET' && url.pathname === '/api/accuses') {
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({
                    code: 200,
                    message: 'success',
                    data: {
                        data: [accuseItem, handledAccuseItem],
                        last_page: 1,
                        pending_count: 1,
                        my_pending_count: 1,
                    },
                }),
            });
            return;
        }

        if (request.method() === 'POST' && url.pathname === '/api/accuses/104/hint') {
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({
                    code: 200,
                    message: 'success',
                    data: {
                        locked_count: '0',
                        user_status: '正常',
                    },
                }),
            });
            return;
        }

        await route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify({
                code: 200,
                message: 'success',
                data: accuseItem,
            }),
        });
    });

    await page.route('**/api/forums/', async (route) => {
        await route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify({
                code: 200,
                message: 'success',
                data: [
                    {
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
                    },
                ],
            }),
        });
    });

    const response = await page.goto('/accuse', { waitUntil: 'domcontentloaded' });

    expect(response?.ok()).toBe(true);
    await expect(page.getByText('举报中心')).toBeVisible();
    await expect(page.getByText('小岛：综合版').first()).toBeVisible();
    await expect(page.getByText('祝福池活动集中帖').first()).toBeVisible();
    await expect(page.getByText('楼层：').first()).toBeVisible();
    await expect(page.getByText('近期被举报').first()).toBeVisible();
    await expect(page.getByText('近期被举报 3 次，被删帖 2 次').first()).toBeVisible();
    await expect(page.getByText('处理操作：删帖')).toBeVisible();

    await page.getByText('操作').first().click();
    await expect(page.getByText('提示')).toBeVisible();
    await expect(page.getByText('删全')).toBeVisible();

    await page.getByText('删全').click();
    await expect(page.getByRole('heading', { name: '删全', exact: true })).toBeVisible();
    await expect(page.getByText('罚款olo')).toBeVisible();
    await expect(page.getByPlaceholder('必填')).toBeVisible();
    await page.getByRole('button', { name: '关闭' }).click();

    await page.goto('/accuse?thread_id=181261&post_id=952999&floor=0', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('新增举报')).toBeVisible();
    await expect(page.locator('input[value="181261"]')).toBeDisabled();
    await expect(page.locator('input[value="№0"]')).toBeDisabled();
    await expect(page.getByPlaceholder(/填写举报理由/)).toBeVisible();

    expect(browserErrors).toEqual([]);
});
