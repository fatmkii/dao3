import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const captchaImage = readFileSync(new URL('./fixtures/captcha.png', import.meta.url)).toString('base64');

async function openThread(page: Page, admin = 0) {
    await page.addInitScript(() => {
        localStorage.setItem('Binggan', 'captcha_test');
        localStorage.setItem('Token', 'test-token');
        localStorage.setItem('userMyEmoji:captcha_test', JSON.stringify({ version: null, emojis: [] }));
    });
    await page.route('**/api/user/show', route => route.fulfill({ json: {
        code: 200, message: 'success', data: {
            binggan: {
                nickname: '测试用户', coin: 100, coin_in_bank: 0, use_pingbici: false,
                new_msg: false, user_lv: 0, locked_ttl: 0, admin,
            },
            my_battle_chara: [], my_emoji_version: null, emoji_excluded: [],
            pingbici: { content_pingbici: [], fjf_pingbici: [], title_pingbici: [] },
        },
    } }));
    const forum = {
        id: 10, sub_id: 0, name: '灌水岛', description: '', status: 1,
        is_anonymous: 0, accessible_coin: 0, is_nissin: 0, banners: [],
        default_heads: 0, deleted_at: null,
    };
    await page.route('**/api/forums/', route => route.fulfill({ json: {
        code: 200, message: 'success', data: [forum],
    } }));
    await page.route('**/api/loudspeaker/show**', route => route.fulfill({ json: {
        code: 200, message: 'success', data: [],
    } }));
    await page.route('**/api/threads/123**', route => route.fulfill({ json: {
        code: 200, message: 'success', data: {
            forum_data: forum,
            thread_data: {
                id: 123, sub_id: 0, forum_id: 10, title: '验证码测试', sub_title: '',
                nickname: '测试用户', random_heads_group: 1, posts_num: 1,
                vote_question_id: null, gamble_question_id: null, crowd_id: null,
                hongbao_id: null, title_color: null, anti_jingfen: false,
                nissin_date: null, has_nissined: false, can_battle: false,
                is_delay: false, locked_by_coin: 0, is_private: false,
                created_at: '2026-09-22 12:00:00', updated_at: '2026-09-22 12:00:00',
            },
            posts_data: { currentPage: 1, lastPage: 1, data: [{
                id: 1001, thread_id: 123, floor: 0, is_deleted: 0,
                is_your_post: true, random_head: 0, created_by_admin: 0,
                nickname: '测试用户', created_at: '2026-09-22 12:00:00',
                battle_id: null, hongbao_id: null, hongbao_data: null, content: '验证码测试主题',
            }] },
            your_post_floors: [0], watermark_string: 'test-watermark',
        },
    } }));
    await page.goto('/thread/123/1', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('textbox', { name: '正文内容' })).toBeVisible();
}

test('验证码答错换图后成功，每次解锁只重试一条回复', async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const posts: string[] = [];
    let captchaRequests = 0;
    let unlockRequests = 0;
    let needsCaptcha = true;
    await page.route('**/api/posts/create', route => {
        posts.push(route.request().postDataJSON().content);
        if (needsCaptcha) {
            return route.fulfill({ json: { code: 244291, message: '请完成验证码后继续' } });
        }
        needsCaptcha = true;
        return route.fulfill({ json: {
            code: 200, message: '发表回复成功！奥利奥+10', data: { forum_id: 10, thread_id: 123, post_id: 1002 },
        } });
    });
    await page.route('**/api/captcha', route => {
        expect(new URL(route.request().url()).search).toBe('');
        expect(route.request().headers().authorization).toBe('Bearer test-token');
        captchaRequests++;
        return route.fulfill({ json: {
            code: 200, message: 'success', data: {
                captcha_key: `key-${captchaRequests}`,
                captcha_img: captchaImage,
            },
        } });
    });
    await page.route('**/api/user/water_unlock', route => {
        const data = route.request().postDataJSON();
        unlockRequests++;
        expect(data.type).toBe('new_post');
        expect(data.captcha_key).toBe(`key-${captchaRequests}`);
        if (data.captcha_code !== 'abcd') {
            return route.fulfill({ json: { code: 24401, message: '验证码错误' } });
        }
        needsCaptcha = false;
        return route.fulfill({ json: { code: 200, message: '已解除限制。' } });
    });
    await openThread(page);
    const content = page.getByRole('textbox', { name: '正文内容' });
    const captcha = page.getByPlaceholder('请输入验证码');
    for (const text of ['第一次人工回复', '第二次人工回复']) {
        await content.fill(text);
        await page.getByRole('button', { name: '提交', exact: true }).click();
        await expect(captcha).toBeVisible();
        await expect(content).toHaveValue(text);
        await expect(page.getByRole('img', { name: '验证码，点击换一张' })).toBeVisible();
        if (text === '第一次人工回复') {
            await captcha.fill('bad');
            await captcha.press('Enter');
            await expect.poll(() => captchaRequests).toBe(2);
            await expect(captcha).toHaveValue('');
            await expect(content).toHaveValue(text);
            await page.screenshot({ path: testInfo.outputPath('captcha-retry.png'), fullPage: true });
        }
        await captcha.fill('abcd');
        await captcha.press('Enter');
        await expect(captcha).toBeHidden();
        await expect(content).toHaveValue('');
    }
    expect(posts).toEqual(['第一次人工回复', '第一次人工回复', '第二次人工回复', '第二次人工回复']);
    expect(unlockRequests).toBe(3);
    expect(errors).toEqual([]);
});

test('管理员中心不再显示种田巡逻评分入口', async ({ page }, testInfo) => {
    const scoreRequests: string[] = [];
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
        if (request.url().includes('/api/admin/antibot_scores')) scoreRequests.push(request.url());
    });
    await page.route('**/api/admin/actives**', route => route.fulfill({ json: {
        code: 200, message: 'success', data: { data: [], last_page: 1 },
    } }));
    await openThread(page, 99);
    await page.goto('/admin-center', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('版头设定', { exact: true })).toBeVisible();
    await expect(page.getByText('种田巡逻', { exact: true })).toHaveCount(0);
    expect(scoreRequests).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('admin-without-scores.png'), fullPage: true });
});
