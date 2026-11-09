import { expect, test, type Page } from '@playwright/test';

async function setup(page: Page) {
    const state = {
        rows: Array.from({ length: 9 }, (_, i) => ({ emoji_group_id: i + 1, votes_num_total: 90 - i * 10 })),
        rankings: 0, users: 0, groups: [] as number[], failRanking: false, failGroup: false,
        holdRanking: null as null | Promise<void>, holdGroup: null as null | Promise<void>,
    };
    await page.clock.install({ time: new Date('2026-11-12T12:00:00Z') });
    await page.addInitScript(() => {
        localStorage.setItem('Binggan', 'contest-user');
        localStorage.setItem('Token', 'test-token');
    });
    await page.route('**/api/user/show', route => route.fulfill({ json: {
        code: 200, data: {
            binggan: { nickname: 'contest', coin: 10000, coin_in_bank: 0, user_lv: 1, locked_ttl: 0 },
            my_battle_chara: [], emoji_excluded: [], my_emoji_version: null,
            pingbici: { content_pingbici: [], fjf_pingbici: [], title_pingbici: [] },
        },
    } }));
    await page.route('**/api/user/my_emoji', route => route.fulfill({ json: { code: 200, data: { my_emoji_version: null, my_emoji: [] } } }));
    await page.route('https://wmimg.com/**', route => route.fulfill({
        contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="#ddd"/></svg>',
    }));
    await page.route('**/api/emoji_contest/**', async route => {
        const path = new URL(route.request().url()).pathname;
        if (path.endsWith('/ranking')) {
            state.rankings++;
            const rows = structuredClone(state.rows);
            const hold = state.holdRanking;
            state.holdRanking = null;
            if (hold) await hold;
            return route.fulfill({ json: state.failRanking ? { code: 500, message: '排名加载失败' } : { code: 200, data: rows } });
        }
        if (path.endsWith('/show_user_votes')) {
            state.users++;
            return route.fulfill({ json: { code: 200, data: [] } });
        }
        if (path.endsWith('/user_vote')) {
            state.rows = [{ emoji_group_id: 2, votes_num_total: 180 }, ...state.rows.filter(row => row.emoji_group_id !== 2)];
            return route.fulfill({ json: { code: 200, message: '投票成功！' } });
        }
        const group = Number(path.split('/').pop());
        state.groups.push(group);
        const hold = state.holdGroup;
        state.holdGroup = null;
        if (hold) await hold;
        return route.fulfill({ json: state.failGroup ? { code: 500, message: '分组加载失败' } : {
            code: 200, data: [{ emoji_id: 0, votes_num_total: group === 1 ? 30 : 80 }],
        } });
    });
    await page.goto('/emoji-moe', { waitUntil: 'domcontentloaded' });
    return state;
}

const ranking = (page: Page) => page.getByLabel('实时排名', { exact: true });
const refresh = (page: Page) => page.getByRole('button', { name: '刷新排名和当前标签页', exact: true });

test('ranking refreshes personal and group tabs, preserves entries and supports mobile scrolling', async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const state = await setup(page);
    const board = ranking(page);
    await expect(board.getByRole('button', { name: /^查看/ })).toHaveCount(9);
    await expect(board.getByRole('button', { name: /^查看/ }).first()).toContainText('比格多栋');
    await expect(board.getByRole('img', { name: '比格多栋' })).toHaveAttribute('src', 'https://wmimg.com/i/1547/2025/11/6910c488ea284.jpg');
    const header = board.locator('.ranking-header');
    const titleBox = await header.getByText('实时排名', { exact: true }).boundingBox();
    const refreshBox = await refresh(page).boundingBox();
    expect(refreshBox!.x).toBeGreaterThan(titleBox!.x + titleBox!.width);
    expect(Math.abs((refreshBox!.y + refreshBox!.height / 2) - (titleBox!.y + titleBox!.height / 2))).toBeLessThan(2);
    const original = await board.getByRole('button', { name: '查看四荤一素的投票' }).elementHandle();
    await refresh(page).click();
    await expect.poll(() => state.rankings).toBe(2);
    await expect.poll(() => state.users).toBe(2);
    await board.getByRole('button', { name: '查看四荤一素的投票' }).click();
    await expect(page.locator('.n-tabs-tab--active')).toHaveText('四荤一素');
    await expect.poll(() => state.groups).toEqual([2]);
    state.rows = [{ emoji_group_id: 2, votes_num_total: 180 }, ...state.rows.filter(row => row.emoji_group_id !== 2)];
    await refresh(page).click();
    await expect(board.getByRole('button', { name: /^查看/ }).first()).toContainText('四荤一素');
    await expect(board.getByRole('button', { name: /^查看/ }).first()).toContainText('180 票');
    expect(await original!.evaluate(el => el === document.querySelector('.ranking-item'))).toBe(true);
    await expect.poll(() => state.groups).toEqual([2, 2]);
    expect(state.users).toBe(2);
    await page.screenshot({ path: testInfo.outputPath('ranking-desktop.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    const scroll = board.getByLabel('横向滚动查看全部排名');
    expect(await scroll.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
    await scroll.evaluate(el => { el.scrollLeft = 150; });
    await refresh(page).click();
    await expect(refresh(page)).toBeEnabled();
    expect(await scroll.evaluate(el => el.scrollLeft)).toBe(150);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('ranking-mobile.png'), fullPage: true });
    expect(errors).toEqual([]);
});

test('refresh failures retain data and successful sections update independently', async ({ page }) => {
    const state = await setup(page);
    await expect(ranking(page).getByRole('button', { name: /^查看/ })).toHaveCount(9);
    await ranking(page).getByRole('button', { name: '查看四荤一素的投票' }).click();
    await expect(page.getByText('四荤一素 总票数： 80')).toBeVisible();
    state.failRanking = true;
    await refresh(page).click();
    await expect(ranking(page).getByRole('status')).toContainText('显示上次结果');
    expect(state.groups).toEqual([2, 2]);
    state.failRanking = false;
    state.failGroup = true;
    state.rows = [{ emoji_group_id: 2, votes_num_total: 200 }, ...state.rows.filter(row => row.emoji_group_id !== 2)];
    await refresh(page).click();
    await expect(ranking(page).getByRole('button', { name: /^查看/ }).first()).toContainText('200 票');
    await expect(page.getByText('四荤一素 总票数： 80')).toBeVisible();
    await expect(ranking(page).getByRole('status')).toHaveCount(0);
});

test('vote refresh wins over an older in-flight ranking request', async ({ page }) => {
    const state = await setup(page);
    await ranking(page).getByRole('button', { name: '查看四荤一素的投票' }).click();
    let release!: () => void;
    state.holdRanking = new Promise<void>(resolve => { release = resolve; });
    await refresh(page).click();
    await expect(refresh(page)).toBeDisabled();
    await page.locator('.emoji-moe-box').first().click();
    await page.locator('.n-input-number').getByRole('textbox').fill('1');
    await page.getByRole('button', { name: '投票', exact: true }).click();
    await expect.poll(() => state.rankings).toBe(3);
    await expect(ranking(page).getByRole('button', { name: /^查看/ }).first()).toContainText('180 票');
    release();
    await expect(refresh(page)).toBeEnabled();
    await expect(ranking(page).getByRole('button', { name: /^查看/ }).first()).toContainText('180 票');
    await expect.poll(() => state.users).toBe(2);
});

test('initial failure can be retried and reduced motion displays final numbers', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const state = await setup(page);
    state.failRanking = true;
    await page.reload();
    await expect(ranking(page).getByRole('status')).toContainText('加载失败');
    await expect(ranking(page).getByRole('button', { name: /^查看/ })).toHaveCount(0);
    state.failRanking = false;
    await refresh(page).click();
    await expect(ranking(page).getByRole('button', { name: /^查看/ })).toHaveCount(9);
    state.rows = state.rows.map(row => ({ ...row, votes_num_total: 0 }));
    await refresh(page).click();
    await expect(ranking(page).getByRole('button', { name: /^查看/ }).first()).toContainText('0 票');
});

test('visitors see import prompt without requesting contest data', async ({ page }) => {
    const calls: string[] = [];
    page.on('request', request => { if (request.url().includes('/api/emoji_contest/')) calls.push(request.url()); });
    await page.goto('/emoji-moe', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('请先导入饼干查看排名和投票数据。')).toBeVisible();
    await expect(refresh(page)).toBeDisabled();
    expect(calls).toEqual([]);
});


test('switching groups ignores a slower previous response and supports keyboard selection', async ({ page }) => {
    const state = await setup(page);
    await expect(ranking(page).getByRole('button', { name: /^查看/ })).toHaveCount(9);
    let release!: () => void;
    state.holdGroup = new Promise<void>(resolve => { release = resolve; });
    await ranking(page).getByRole('button', { name: '查看比格多栋的投票' }).click();
    await expect.poll(() => state.groups).toEqual([1]);
    const second = ranking(page).getByRole('button', { name: '查看四荤一素的投票' });
    await second.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('四荤一素 总票数： 80')).toBeVisible();
    release();
    await expect.poll(() => state.groups).toEqual([1, 2]);
    await expect(page.getByText('四荤一素 总票数： 80')).toBeVisible();
});


test('ranking changes animate positions and count through intermediate vote values', async ({ page }) => {
    const state = await setup(page);
    await expect(ranking(page).getByRole('button', { name: /^查看/ })).toHaveCount(9);
    await page.evaluate(() => {
        const result = { moved: false, counted: false };
        (window as any).__rankingMotion = result;
        const start = performance.now();
        const sample = () => {
            const item = document.querySelector('button[aria-label="查看四荤一素的投票"]')!;
            result.moved ||= item.getAnimations().some(animation => animation.playState === 'running');
            const votes = Number.parseInt(item.querySelector('.ranking-votes')!.textContent!, 10);
            result.counted ||= votes > 80 && votes < 180;
            if (performance.now() - start < 3000) requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
    });
    state.rows = [{ emoji_group_id: 2, votes_num_total: 180 }, ...state.rows.filter(row => row.emoji_group_id !== 2)];
    await refresh(page).click();
    await expect.poll(() => page.evaluate(() => (window as any).__rankingMotion)).toEqual({ moved: true, counted: true });
    await expect(ranking(page).getByRole('button', { name: /^查看/ }).first()).toContainText('180 票');
});
