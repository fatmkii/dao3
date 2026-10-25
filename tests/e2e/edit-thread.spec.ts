import { expect, test, type Page } from '@playwright/test';

const forum = {
    id: 1, sub_id: 0, name: '测试岛', description: '', status: 1, is_anonymous: 0,
    accessible_coin: 0, is_nissin: 0, banners: [], default_heads: 1, deleted_at: null,
};
const thread = {
    id: 10001, sub_id: 0, forum_id: 1, title: '不可变标题', sub_title: '', nickname: '原始昵称',
    random_heads_group: 1, posts_num: 0, vote_question_id: null, gamble_question_id: null,
    crowd_id: null, hongbao_id: null, title_color: null, anti_jingfen: false,
    nissin_date: null, has_nissined: false, can_battle: false, is_delay: false,
    locked_by_coin: 0, is_private: false, is_your_thread: true,
    can_edit_first_post: true, can_view_first_post_history: true,
    created_at: '2026-10-01 10:00:00', updated_at: '2026-10-01 11:00:00',
};
const firstPost = {
    nickname: '原始昵称', content: '原始正文', random_head: 1, created_by_admin: 0,
    is_deleted: 0, created_binggan_hash: null,
};
const context = { thread_data: thread, forum_data: forum, first_post: firstPost, watermark_string: 'test-watermark' };

async function mockPage(page: Page, owner = true) {
    await page.addInitScript(() => {
        localStorage.setItem('Binggan', 'edit_binggan');
        localStorage.setItem('Token', 'test-token');
    });
    await page.route('**://*/api/**', async route => {
        const path = new URL(route.request().url()).pathname;
        let data: unknown = [];
        if (path === '/api/user/show') {
            data = {
                binggan: { nickname: '当前昵称', admin: 0, admin_forums: [], coin: 3000, coin_in_bank: 0,
                    use_pingbici: false, new_msg: false, user_lv: 1, locked_ttl: 0 },
                my_battle_chara: [], my_emoji_version: null, emoji_excluded: [],
                pingbici: { content_pingbici: [], fjf_pingbici: [], title_pingbici: [] },
            };
        } else if (path === '/api/user/my_emoji') {
            data = { my_emoji_version: null, my_emoji: [] };
        } else if (path === '/api/forums/') {
            data = [forum];
        } else if (path.endsWith('/first-post/edit')) {
            data = context;
        } else if (path.endsWith('/first-post/history')) {
            const currentPage = Number(new URL(route.request().url()).searchParams.get('page') ?? 1);
            data = { ...context, pagination: { currentPage, lastPage: 2, total: 21 }, versions: currentPage === 1 ? [
                { version: 0, content: '原始正文\n<b>原始排版</b>', version_at: '2026-10-01 10:00:00', is_current: false },
                { version: 1, content: '修改后的正文', version_at: '2026-10-02 10:00:00', is_current: false },
            ] : [{ version: 20, content: '最新正文', version_at: '2026-10-03 10:00:00', is_current: true }] };
        } else if (path === '/api/threads/10001') {
            data = { ...context, thread_data: { ...thread, is_your_thread: owner, can_edit_first_post: owner },
                posts_data: { currentPage: 1, lastPage: 1, data: [{
                    ...firstPost, id: 1000001, thread_id: 10001, floor: 0, is_your_post: owner,
                    created_at: thread.created_at, battle_id: null, hongbao_id: null, hongbao_data: null, edit_count: 2,
                }] }, your_post_floors: [],
            };
        }
        await route.fulfill({ json: { code: 200, message: 'success', data } });
    });
}

async function confirmEdit(page: Page) {
    await page.getByRole('button', { name: '提交', exact: true }).click();
    await expect(page.getByText('修改首楼花费300olo，是否确定？', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '确定', exact: true }).click();
}

test('only the owner sees edit, while readers can open history', async ({ page }) => {
    await mockPage(page, false);
    await page.goto('/thread/10001');
    await expect(page.getByRole('button', { name: '修改', exact: true })).toHaveCount(0);
    await expect(page.getByRole('link', { name: '历史', exact: true })).toHaveAttribute('href', '/edit-thread-history/10001');
    await expect(page.locator('#f_0').getByText('有2次修改', { exact: true })).toBeVisible();
});

test('edit preloads immutable identity, hides special features, and cancel does not submit', async ({ page }) => {
    await mockPage(page);
    let writes = 0;
    page.on('request', request => { if (request.method() === 'PUT') writes++; });
    await page.goto('/edit-thread/10001');
    await expect(page.getByPlaceholder('标题内容')).toHaveValue('不可变标题');
    await expect(page.getByPlaceholder('标题内容')).toBeDisabled();
    await expect(page.locator('input.nickname-input')).toHaveValue('原始昵称');
    await expect(page.locator('input.nickname-input')).toBeDisabled();
    await expect(page.getByPlaceholder('正文内容')).toHaveValue('原始正文');
    await expect(page.getByRole('tab')).toHaveCount(0);
    await expect(page.getByText('延时发送', { exact: true })).toHaveCount(0);
    await expect(page.locator('.recording-input-icon')).toHaveCount(0);
    await page.getByRole('button', { name: '功能', exact: true }).click();
    await expect(page.getByText('管理员', { exact: true })).toHaveCount(0);
    await page.getByPlaceholder('正文内容').fill('我的草稿');
    await page.getByRole('button', { name: '提交', exact: true }).click();
    await page.getByRole('button', { name: '取消', exact: true }).click();
    await expect(page.getByRole('button', { name: '提交', exact: true })).toBeEnabled();
    await expect(page.getByPlaceholder('正文内容')).toHaveValue('我的草稿');
    await page.getByRole('button', { name: '返回主题', exact: true }).click();
    await expect(page).toHaveURL(/\/thread\/10001$/);
    expect(writes).toBe(0);
});

test('confirmed edit sends only body and operation ID and returns to the thread', async ({ page }) => {
    await mockPage(page);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    let payload: Record<string, unknown> | undefined;
    await page.route('**/api/threads/10001/first-post', async route => {
        payload = route.request().postDataJSON();
        await route.fulfill({ json: { code: 200, message: 'success', data: { thread_id: 10001, version: 1 } } });
    });
    await page.goto('/edit-thread/10001');
    await page.getByPlaceholder('正文内容').fill('修改后正文');
    await confirmEdit(page);
    await expect(page).toHaveURL(/\/thread\/10001\/1$/);
    expect(payload).toEqual({ content: '修改后正文', request_id: expect.stringMatching(/^[0-9a-f-]{14}4[0-9a-f-]{21}$/) });
    expect(errors).toEqual([]);
});

test('business and HTTP validation errors keep the draft editable', async ({ page }) => {
    await mockPage(page);
    let attempts = 0;
    await page.route('**/api/threads/10001/first-post', async route => {
        attempts++;
        await route.fulfill(attempts === 1
            ? { json: { code: 21412, message: '奥利奥不足了' } }
            : { status: 422, json: { message: '正文必须填写', errors: { content: ['正文必须填写'] } } });
    });
    await page.goto('/edit-thread/10001');
    await page.getByPlaceholder('正文内容').fill('保留的草稿');
    await confirmEdit(page);
    await expect(page.getByRole('button', { name: '提交', exact: true })).toBeEnabled();
    await expect(page.getByPlaceholder('正文内容')).toHaveValue('保留的草稿');
    await expect(page.getByPlaceholder('正文内容')).toBeEditable();
    await confirmEdit(page);
    await expect(page.getByPlaceholder('正文内容')).toBeEditable();
    await expect(page.getByRole('button', { name: '重试本次修改' })).toHaveCount(0);
});

test('an uncertain response retries the frozen operation without a second confirmation', async ({ page }) => {
    await mockPage(page);
    const payloads: unknown[] = [];
    await page.route('**/api/threads/10001/first-post', async route => {
        payloads.push(route.request().postDataJSON());
        if (payloads.length === 1) await route.abort('failed');
        else await route.fulfill({ json: { code: 200, message: 'success', data: { thread_id: 10001, version: 1 } } });
    });
    await page.goto('/edit-thread/10001');
    await page.getByPlaceholder('正文内容').fill('超时的修改');
    await confirmEdit(page);
    await expect(page.getByRole('button', { name: '重试本次修改' })).toBeVisible();
    await expect(page.getByPlaceholder('正文内容')).toHaveValue('超时的修改');
    await expect(page.getByPlaceholder('正文内容')).toBeDisabled();
    await page.getByRole('button', { name: '重试本次修改' }).click();
    await expect(page).toHaveURL(/\/thread\/10001\/1$/);
    expect(payloads).toHaveLength(2);
    expect(payloads[0]).toEqual(payloads[1]);
});

test('unresolved paid operation survives rejected confirmation retries', async ({ page }) => {
    await mockPage(page);
    const failures = [
        { status: 401, code: 401 },
        { status: 429, code: 429 },
        { status: 422, code: 422 },
        { status: 200, code: 21412 },
    ];
    const payloads: unknown[] = [];
    await page.route('**/api/threads/10001/first-post', async route => {
        payloads.push(route.request().postDataJSON());
        if (payloads.length === 1) {
            // The paid operation may have committed before its response was lost.
            await route.abort('failed');
            return;
        }
        const failure = failures[payloads.length - 2];
        if (failure) {
            await route.fulfill({ status: failure.status, json: { code: failure.code, message: '确认请求暂时被拒绝' } });
        } else {
            await route.fulfill({ json: { code: 200, message: 'success', data: { thread_id: 10001, version: 1 } } });
        }
    });
    await page.goto('/edit-thread/10001');
    await page.getByPlaceholder('正文内容').fill('已提交但结果未知的正文');
    await confirmEdit(page);
    const retry = page.getByRole('button', { name: '重试本次修改' });
    await expect(retry).toBeVisible();
    for (const failure of failures) {
        const rejection = page.waitForResponse(response => response.request().method() === 'PUT'
            && new URL(response.url()).pathname === '/api/threads/10001/first-post');
        await retry.click();
        await rejection;
        if (failure.status === 401) {
            await page.getByRole('button', { name: '关闭', exact: true }).last().click();
        }
        await expect(retry).toBeEnabled();
        await expect(page.getByPlaceholder('正文内容')).toHaveValue('已提交但结果未知的正文');
        await expect(page.getByPlaceholder('正文内容')).toBeDisabled();
        await expect(page.getByRole('button', { name: '提交', exact: true })).toBeDisabled();
        await expect(page).toHaveURL(/\/edit-thread\/10001$/);
    }
    await retry.click();
    await expect(page).toHaveURL(/\/thread\/10001\/1$/);
    expect(payloads).toEqual(Array(failures.length + 2).fill(payloads[0]));
});

test('history renders read-only versions with unique anchors, timestamps and pagination', async ({ page }) => {
    await mockPage(page);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/edit-thread-history/10001');
    const returnLinks = page.getByRole('link', { name: '返回主题', exact: true });
    await expect(returnLinks).toHaveCount(2);
    const returnLink = returnLinks.first();
    await expect(returnLink).toHaveAttribute('href', '/thread/10001');
    await expect(returnLink.locator('svg')).toBeVisible();
    for (const link of await returnLinks.all()) {
        const navigationLayout = await link.evaluate(element => {
            const icon = element.getBoundingClientRect();
            const pagination = element.parentElement!.querySelector('.n-pagination')!.getBoundingClientRect();
            return {
                iconRight: icon.right, paginationLeft: pagination.left,
                centerDifference: Math.abs(icon.top + icon.height / 2 - pagination.top - pagination.height / 2),
                color: getComputedStyle(element).color,
                parentColor: getComputedStyle(element.parentElement!).color,
            };
        });
        expect(navigationLayout.paginationLeft).toBeGreaterThan(navigationLayout.iconRight);
        expect(navigationLayout.centerDifference).toBeLessThan(1);
        expect(navigationLayout.color).toBe(navigationLayout.parentColor);
    }
    await expect(page.locator('.thread-title')).toHaveText('（修改历史）不可变标题');
    await expect(page.locator('#revision-0 .post-footer-text')).toHaveText('№0');
    await expect(page.locator('#revision-1 .post-footer-text')).toHaveText('№1');
    await expect(page.getByText('原始版本', { exact: true })).toHaveCount(0);
    await expect(page.getByText('当前版本', { exact: true })).toHaveCount(0);
    await expect(page.locator('#revision-0 .post-created-at')).toHaveText('2026-10-01 10:00:00');
    await expect(page.locator('#revision-1 .post-created-at')).toHaveText('2026-10-02 10:00:00');
    await expect(page.locator('#revision-0 b')).toHaveText('原始排版');
    await expect(page.locator('[id="f_0"]')).toHaveCount(0);
    await expect(page.locator('.post-item .n-icon')).toHaveCount(0);
    await expect(page.getByPlaceholder('正文内容')).toHaveCount(0);
    await expect(page.getByRole('button', { name: '变色', exact: true })).toHaveCount(0);
    await page.getByText('2', { exact: true }).last().click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.locator('#revision-20 .post-footer-text')).toHaveText('№20');
    await expect(page.getByText('第 20 次修改', { exact: true })).toHaveCount(0);
    await expect(page.getByText('当前版本', { exact: true })).toBeVisible();
    const labelCenterDifference = await page.getByText('当前版本', { exact: true }).evaluate(element => {
        const label = element.getBoundingClientRect();
        const header = element.parentElement!.getBoundingClientRect();
        return Math.abs(label.top + label.height / 2 - header.top - header.height / 2);
    });
    expect(labelCenterDifference).toBeLessThan(1);
    await page.getByRole('button', { name: '返回主题', exact: true }).click();
    await expect(page).toHaveURL(/\/thread\/10001$/);
    expect(errors).toEqual([]);
});
