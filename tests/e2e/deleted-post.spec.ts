import { expect, test } from '@playwright/test';

for (const viewer of ['管理员', '发帖者']) {
    test(`管理员删除帖只在${viewer}展开时挂载正文`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.addInitScript(() => {
            localStorage.setItem('Binggan', 'deleted_post_test');
            localStorage.setItem('Token', 'test-token');
            localStorage.setItem('userMyEmoji:deleted_post_test', JSON.stringify({ version: null, emojis: [] }));
        });
        await page.route('**/api/user/show', route => route.fulfill({ json: {
            code: 200, message: 'success', data: {
                binggan: {
                    nickname: '测试用户', coin: 0, coin_in_bank: 0, use_pingbici: false,
                    new_msg: false, user_lv: 0, locked_ttl: 0,
                    admin: viewer === '管理员' ? 10 : 0,
                },
                my_battle_chara: [], my_emoji_version: null, emoji_excluded: [],
                pingbici: { content_pingbici: [], fjf_pingbici: [], title_pingbici: [] },
            },
        } }));
        const forum = {
            id: 1, sub_id: 0, name: '测试岛', description: '', status: 1,
            is_anonymous: 0, accessible_coin: 0, is_nissin: 0, banners: [],
            default_heads: 0, deleted_at: null,
        };
        await page.route('**/api/forums/', route => route.fulfill({ json: {
            code: 200, message: 'success', data: [forum],
        } }));
        await page.route('**/api/loudspeaker/show**', route => route.fulfill({ json: {
            code: 200, message: 'success', data: [],
        } }));
        let deletionState = 2;
        await page.route('**/api/threads/123**', route => route.fulfill({ json: {
            code: 200, message: 'success', data: {
                forum_data: forum,
                thread_data: {
                    id: 123, sub_id: 0, forum_id: 1, title: '删除帖折叠测试', sub_title: '',
                    nickname: '测试用户', random_heads_group: 1, posts_num: 1,
                    vote_question_id: null, gamble_question_id: null, crowd_id: null,
                    hongbao_id: null, title_color: null, anti_jingfen: false,
                    nissin_date: null, has_nissined: false, can_battle: false,
                    is_delay: false, locked_by_coin: 0, is_private: false,
                    created_at: '2026-09-20 12:00:00', updated_at: '2026-09-20 12:00:00',
                },
                posts_data: { currentPage: 1, lastPage: 1, data: [{
                    id: 1001, thread_id: 123, floor: 1, is_deleted: deletionState,
                    is_your_post: viewer === '发帖者', random_head: 0, created_by_admin: 0,
                    nickname: '测试用户', created_at: '2026-09-20 12:00:00',
                    battle_id: null, hongbao_id: null, hongbao_data: null,
                    content: '<style>body { --deleted-post-probe: active; }</style>'
                        + '<b>已删除的测试正文</b><details><summary>用户折叠</summary><p>用户隐藏内容</p></details>',
                }] },
                your_post_floors: [], watermark_string: 'test-watermark',
            },
        } }));

        await page.goto('/thread/123/1', { waitUntil: 'domcontentloaded' });
        const expand = page.getByRole('button', { name: `此贴已被管理员删除（${viewer}可点击展开）` });
        const collapse = page.getByRole('button', { name: `此贴已被管理员删除（${viewer}可点击收起）` });
        const body = page.getByText('已删除的测试正文', { exact: true });
        const styleProbe = () => page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--deleted-post-probe').trim());

        await expect(expand).toBeVisible();
        await expect(body).toHaveCount(0);
        await expect.poll(styleProbe).toBe('');
        // 收起时引用仍可操作，也不会挂载正文。
        await page.getByText('№1', { exact: true }).click();
        await expect(page.getByRole('textbox', { name: '正文内容' })).toHaveValue(/此贴已被管理员删除/);
        await expect(body).toHaveCount(0);

        for (let count = 0; count < 2; count++) {
            await expand.click();
            await expect(collapse).toHaveAttribute('aria-expanded', 'true');
            await expect(body).toBeVisible();
            await expect.poll(styleProbe).toBe('active');
            await page.getByText('用户折叠', { exact: true }).click();
            await expect(page.getByText('用户隐藏内容', { exact: true })).toBeVisible();
            await collapse.click();
            await expect(expand).toHaveAttribute('aria-expanded', 'false');
            await expect(body).toHaveCount(0);
            await expect.poll(styleProbe).toBe('');
        }
        await expand.click();
        await expect(body).toBeVisible();
        await page.getByText('№1', { exact: true }).click();
        await expect(body).toHaveCount(0);
        await expect.poll(styleProbe).toBe('');
        // 恢复后再次删除同一条帖子，应重置先前的展开状态。
        await expand.click();
        deletionState = 0;
        await page.getByRole('button', { name: '刷新', exact: true }).click();
        await expect(collapse).toHaveCount(0);
        await expect(body).toBeVisible();
        deletionState = 2;
        await page.getByRole('button', { name: '刷新', exact: true }).click();
        await expect(expand).toBeVisible();
        await expect(body).toHaveCount(0);
        await expect.poll(styleProbe).toBe('');
        expect(errors).toEqual([]);
    });
}
