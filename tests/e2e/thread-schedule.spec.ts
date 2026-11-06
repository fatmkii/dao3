import { expect, test, type Page } from '@playwright/test';

async function openComposer(page: Page, time: string) {
    await page.clock.setFixedTime(new Date(time));
    await page.addInitScript(() => {
        localStorage.setItem('Binggan', 'schedule_test');
        localStorage.setItem('Token', 'test-token');
    });
    await page.route('**://*/api/**', async route => {
        const path = new URL(route.request().url()).pathname;
        let data: unknown = [];
        if (path === '/api/user/show') data = {
            binggan: { nickname: '预约测试', admin: 0, admin_forums: [], coin: 3000, coin_in_bank: 0,
                use_pingbici: false, new_msg: false, user_lv: 1, locked_ttl: 0 },
            my_battle_chara: [], my_emoji_version: null, emoji_excluded: [],
            pingbici: { content_pingbici: [], fjf_pingbici: [], title_pingbici: [] },
        };
        if (path === '/api/user/my_emoji') data = { my_emoji_version: null, my_emoji: [] };
        if (path === '/api/forums/') data = [{ id: 1, sub_id: 0, name: '预约测试岛', description: '', status: 1,
            is_anonymous: 0, accessible_coin: 0, is_nissin: 2, banners: [], default_heads: 1, deleted_at: null }];
        if (path === '/api/threads/create') data = { thread_id: 10001, forum_id: 1 };
        await route.fulfill({ json: { code: 200, message: 'success', data } });
    });
    await page.goto('/new-thread/1');
    await expect(page.getByRole('button', { name: '预约发送', exact: true })).toBeVisible();
}

function dates(page: Page) {
    return page.locator('.n-date-panel-date:not(.n-date-panel-date--disabled)');
}

for (const time of ['2026-11-01T20:00:00+08:00', '2026-11-02T01:00:00+08:00', '2026-11-02T07:59:59+08:00']) {
    test(`seven dates from November 2 through 8 at ${time}`, async ({ page }) => {
        await openComposer(page, time);
        await page.getByRole('button', { name: '预约发送', exact: true }).click();
        await expect(dates(page)).toHaveText(['2', '3', '4', '5', '6', '7', '8']);
        await expect(page.locator('.n-time-picker')).toHaveCount(0);
    });
}

test('select, change, cancel and submit a date', async ({ page }) => {
    await openComposer(page, '2026-11-02T08:00:00+08:00');
    await page.getByRole('button', { name: '预约发送', exact: true }).click();
    await expect(dates(page)).toHaveText(['3', '4', '5', '6', '7', '8', '9']);
    await dates(page).getByText('9', { exact: true }).click();
    await page.getByRole('button', { name: '将在11月9日8点发出' }).click();
    await dates(page).getByText('8', { exact: true }).click();
    await page.getByRole('button', { name: '将在11月8日8点发出' }).click();
    await page.getByRole('button', { name: '取消预约' }).click();
    await page.getByRole('button', { name: '预约发送', exact: true }).click();
    await dates(page).getByText('7', { exact: true }).click();
    await page.getByPlaceholder('正文内容', { exact: true }).fill('预约正文');
    await page.getByPlaceholder('标题内容', { exact: true }).fill('预约主题');
    const request = page.waitForRequest('**/api/threads/create');
    await page.getByRole('button', { name: '提交', exact: true }).click();
    expect((await request).postDataJSON()).toMatchObject({ is_delay: true, scheduled_date: '2026-11-07' });
    await expect(page.getByRole('button', { name: '预约发送', exact: true })).toBeVisible();
});

test('expired selection preserves the draft and asks for a new date', async ({ page }) => {
    await openComposer(page, '2026-11-02T07:59:59+08:00');
    await page.getByRole('button', { name: '预约发送', exact: true }).click();
    await dates(page).getByText('2', { exact: true }).click();
    await page.getByPlaceholder('正文内容', { exact: true }).fill('保留草稿');
    await page.clock.setFixedTime(new Date('2026-11-02T08:00:00+08:00'));
    await page.getByRole('button', { name: '提交', exact: true }).click();
    await expect(page.getByText('预约日期已失效，请重新选择')).toBeVisible();
    await expect(page.getByPlaceholder('正文内容', { exact: true })).toHaveValue('保留草稿');
});

test.describe('mobile in another timezone', () => {
    test.use({ viewport: { width: 390, height: 844 }, timezoneId: 'Pacific/Auckland' });
    test('calendar uses Beijing scheduling dates without overflowing', async ({ page }, testInfo) => {
        await openComposer(page, '2026-11-01T20:00:00+08:00');
        await page.getByRole('button', { name: '预约发送', exact: true }).click();
        await expect(dates(page)).toHaveText(['2', '3', '4', '5', '6', '7', '8']);
        const panel = await page.locator('.n-date-panel').boundingBox();
        expect(panel!.x).toBeGreaterThanOrEqual(0);
        expect(panel!.x + panel!.width).toBeLessThanOrEqual(390);
        await page.screenshot({ path: testInfo.outputPath('thread-schedule-mobile.png') });
    });
});
