import { expect, test } from '@playwright/test';

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

    const response = await page.goto('/', { waitUntil: 'networkidle' });

    expect(response?.ok()).toBe(true);
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.locator('#app')).not.toHaveText('');
    expect(browserErrors).toEqual([]);
});

test('accuse demo renders and supports core interactions', async ({ page }) => {
    const browserErrors: string[] = [];
    const accuseItem = {
        id: 104,
        thread_id: 181261,
        post_id: 952741,
        floor: 233,
        thread_title: '祝福池活动集中帖',
        status: 'pending',
        created_at: '2026-05-29 14:26:18',
        target_recent_count: 3,
        handled_by: null,
        handled_at: null,
        handle_action: null,
        handle_note: null,
        handle_reduce_olo: false,
        uncertain: true,
        reasons: [
            {
                id: 1,
                content: '连续刷屏影响阅读，希望管理员确认一下。',
                created_at: '2026-05-29 14:26:18',
                reporter_recent_count: 2,
            },
        ],
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
                        data: [accuseItem],
                        last_page: 1,
                        pending_count: 1,
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

    const response = await page.goto('/accuse', { waitUntil: 'networkidle' });

    expect(response?.ok()).toBe(true);
    await expect(page.getByText('举报中心')).toBeVisible();
    await expect(page.getByText('祝福池活动集中帖')).toBeVisible();
    await expect(page.getByText('楼层：').first()).toBeVisible();
    await expect(page.getByText('近期被举报').first()).toBeVisible();

    await page.getByText('操作').first().click();
    await expect(page.getByText('提示')).toBeVisible();
    await expect(page.getByText('删全')).toBeVisible();

    await page.getByText('删全').click();
    await expect(page.getByRole('heading', { name: '删全', exact: true })).toBeVisible();
    await expect(page.getByText('罚款olo')).toBeVisible();
    await expect(page.getByPlaceholder('必填')).toBeVisible();
    await page.getByRole('button', { name: '关闭' }).click();

    await page.goto('/accuse?thread_id=181261&post_id=952999&floor=0', { waitUntil: 'networkidle' });
    await expect(page.getByText('新增举报')).toBeVisible();
    await expect(page.locator('input[value="181261"]')).toBeDisabled();
    await expect(page.locator('input[value="№0"]')).toBeDisabled();
    await expect(page.getByPlaceholder(/填写举报理由/)).toBeVisible();

    expect(browserErrors).toEqual([]);
});
