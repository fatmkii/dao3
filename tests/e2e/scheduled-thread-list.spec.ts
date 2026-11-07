import { expect, test, type Page } from '@playwright/test';

async function openList(page: Page) {
    const requests: URL[] = [];
    const forum = { id: 1, sub_id: 0, name: '预约测试岛', description: '', status: 1, is_anonymous: 0,
        accessible_coin: 0, is_nissin: 2, banners: [], default_heads: 1, deleted_at: null };
    await page.addInitScript(() => {
        localStorage.setItem('Binggan', 'schedule_owner');
        localStorage.setItem('Token', 'test-token');
    });
    await page.route('**://*/api/**', async route => {
        const url = new URL(route.request().url());
        let data: unknown = [];
        if (url.pathname === '/api/user/show') data = {
            binggan: { nickname: '预约测试', admin: 0, admin_forums: [], coin: 3000, coin_in_bank: 0,
                use_pingbici: false, new_msg: false, user_lv: 1, locked_ttl: 0 },
            my_battle_chara: [], my_emoji_version: null, emoji_excluded: [],
            pingbici: { content_pingbici: [], fjf_pingbici: [], title_pingbici: [] },
        };
        if (url.pathname === '/api/user/my_emoji') data = { my_emoji_version: null, my_emoji: [] };
        if (url.pathname === '/api/forums/') data = [forum];
        if (url.pathname === '/api/forums/1') {
            requests.push(url);
            const mine = url.searchParams.get('only_mine') === '1';
            const delay = url.searchParams.get('delay') === '1';
            data = { forum_data: forum, subtitles_exclude: [], threads_data: {
                currentPage: Number(url.searchParams.get('page')), lastPage: mine ? 2 : 4,
                data: (mine ? [10001] : [10001, 10002]).map(id => ({
                    id, forum_id: 1, title: id === 10001 ? '我预约的主题' : '其他人的主题', sub_title: '[闲聊]',
                    nickname: '测试用户', posts_num: 0, is_delay: delay, scheduled_at: '2026-11-09 08:00',
                    created_at: '2026-11-07 12:00', updated_at: '2026-11-07 12:00', is_your_thread: false,
                })),
            } };
        }
        await route.fulfill({ json: { code: 200, message: 'success', data } });
    });
    await page.goto('/forum/1/3?delay=true');
    await expect(page.getByRole('link', { name: '其他人的主题', exact: true })).toBeVisible();
    return requests;
}

test('scheduled list shows time and preserves the own-user filter through pagination and reload', async ({ page }) => {
    const requests = await openList(page);
    await expect(page.getByText('Re:', { exact: true })).toHaveCount(0);
    await expect(page.locator('.thread-title-secondary').first()).toContainText('预约时间: 2026-11-09 08:00');
    const toggle = page.getByRole('switch', { name: '只看自己' });
    await toggle.click();
    await expect(toggle).toBeChecked();
    await expect(page.getByRole('link', { name: '其他人的主题', exact: true })).toHaveCount(0);
    await expect.poll(() => requests.at(-1)?.searchParams.get('page')).toBe('1');
    expect(requests.at(-1)?.searchParams.get('only_mine')).toBe('1');
    await page.locator('.n-pagination-item').filter({ hasText: /^2$/ }).click();
    await expect.poll(() => requests.at(-1)?.searchParams.get('page')).toBe('2');
    expect(requests.at(-1)?.searchParams.get('only_mine')).toBe('1');
    await page.reload();
    await expect(toggle).toBeChecked();
    await expect(page.getByRole('link', { name: '其他人的主题', exact: true })).toHaveCount(0);
    await toggle.click();
    await expect(page.getByRole('link', { name: '其他人的主题', exact: true })).toBeVisible();
    expect(requests.at(-1)?.searchParams.get('only_mine')).toBe('0');
    expect(requests.at(-1)?.searchParams.get('page')).toBe('1');
    await page.getByRole('button', { name: '关闭预约主题' }).click();
    await expect(toggle).toHaveCount(0);
    await expect(page.getByText('Re:', { exact: true })).toHaveCount(2);
    await expect(page.getByText('预约时间:', { exact: true })).toHaveCount(0);
});

test('search and clearing search keep the scheduled own-user filter', async ({ page }) => {
    const requests = await openList(page);
    await page.goto('/forum/1/2?delay=true&only_mine=true&search=预约');
    await page.getByPlaceholder('搜索标题').fill('我的预约');
    await page.getByRole('button', { name: '搜索', exact: true }).click();
    await expect.poll(() => requests.at(-1)?.searchParams.get('search_title')).toBe('我的预约');
    expect(requests.at(-1)?.searchParams.get('page')).toBe('1');
    expect(requests.at(-1)?.searchParams.get('only_mine')).toBe('1');
    expect(requests.at(-1)?.searchParams.get('delay')).toBe('1');
    await page.getByRole('button', { name: '清空', exact: true }).click();
    await expect.poll(() => requests.at(-1)?.searchParams.has('search_title')).toBe(false);
    expect(requests.at(-1)?.searchParams.get('only_mine')).toBe('1');
    expect(requests.at(-1)?.searchParams.get('delay')).toBe('1');
});

test('mobile keeps the switch to the left of the action buttons', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openList(page);
    const toggle = await page.getByRole('switch', { name: '只看自己' }).boundingBox();
    const loudspeaker = await page.getByRole('button', { name: '大喇叭', exact: true }).boundingBox();
    expect(toggle!.x + toggle!.width).toBeLessThan(loudspeaker!.x);
    expect(Math.abs(toggle!.y - loudspeaker!.y)).toBeLessThan(10);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.screenshot({ path: testInfo.outputPath('scheduled-thread-list-mobile.png') });
});
