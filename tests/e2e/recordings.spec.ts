import { expect, test, type Page } from '@playwright/test';
import { bridgeMessages, installMessagePortAndroidBridge } from './fixtures/androidBridge';

const forum = {
    id: 1, sub_id: 0, name: '录音测试岛', description: '', status: 1,
    is_anonymous: 0, accessible_coin: 0, is_nissin: 0, banners: [], default_heads: 0, deleted_at: null,
};
const recording = {
    id: 42, duration_ms: 15000, server_time: '2026-10-10T00:00:00Z',
    expires_at: '2026-10-24T00:00:00Z', expired: false, url: 'http://192.168.1.210/test-recording.m4a',
};
async function mockPage(page: Page, recordings = [recording], deleted = false) {
    await page.addInitScript(() => {
        localStorage.setItem('Binggan', 'recording-test');
        localStorage.setItem('Token', 'test-token');
    });
    await page.route('**/api/user/show', route => route.fulfill({ json: { code: 200, data: {
        binggan: { nickname: '测试用户', coin: 100, coin_in_bank: 0, use_pingbici: false,
            new_msg: false, user_lv: 0, locked_ttl: 0, admin: 0, admin_forums: [] },
        my_battle_chara: [], my_emoji_version: null, emoji_excluded: [],
        pingbici: { content_pingbici: [], fjf_pingbici: [], title_pingbici: [] },
    } } }));
    await page.route('**/api/user/my_emoji', route => route.fulfill({ json: { code: 200, data: { my_emoji: [], my_emoji_version: null } } }));
    await page.route('**/api/forums/', route => route.fulfill({ json: { code: 200, data: [forum] } }));
    await page.route('**/api/loudspeaker/show**', route => route.fulfill({ json: { code: 200, data: [] } }));
    await page.route('**/api/mobile/recordings/config', route => route.fulfill({ json: { code: 200, data: { enabled: true } } }));
    await page.route('**/api/threads/123**', route => route.fulfill({ json: { code: 200, data: {
        forum_data: forum,
        thread_data: {
            id: 123, sub_id: 0, forum_id: 1, title: '回帖录音测试', sub_title: '', nickname: '测试用户',
            random_heads_group: 1, posts_num: recordings.length, vote_question_id: null, gamble_question_id: null,
            crowd_id: null, hongbao_id: null, title_color: null, anti_jingfen: false, nissin_date: null,
            has_nissined: false, can_battle: false, is_delay: false, locked_by_coin: 0, is_private: false,
            created_at: '2026-10-10 08:00:00', updated_at: '2026-10-10 08:00:00',
        },
        posts_data: { currentPage: 1, lastPage: 1, data: recordings.map((data, index) => ({
            id: 1001 + index, thread_id: 123, floor: index + 1, is_deleted: deleted ? 1 : 0,
            is_your_post: true, random_head: 0, created_by_admin: 0, nickname: '测试用户',
            created_at: '2026-10-10 08:00:00', battle_id: null, hongbao_id: null, hongbao_data: null,
            content: deleted ? '*此贴已被作者删除*' : '有正文的录音回复', recording_id: data.id, recording_data: data,
        })) }, your_post_floors: [], watermark_string: 'test',
    } } }));
}
async function reply(page: Page, action: string, overrides = {}) {
    const messages = await bridgeMessages(page);
    const payload = messages.filter(message => message.type === 'recordingOpen').at(-1)!.payload;
    await page.evaluate(data => {
        (window as any).__dispatchNativeBridgeMessage(JSON.stringify({ type: 'recordingResult', payload: data }));
    }, { ...payload, action, recording, ...overrides });
}

for (const supported of [false, true]) {
    test(`recording entry requires native capability ${supported}`, async ({ page }) => {
        await installMessagePortAndroidBridge(page, { recordingSupported: supported });
        await mockPage(page);
        await page.goto('/thread/123/1');
        if (supported) await expect(page.getByRole('button', { name: '录音', exact: true })).toBeVisible();
        else await expect(page.getByRole('button', { name: '录音', exact: true })).toHaveCount(0);
    });
}

test('native confirm, stale response, cancel, failure retry and remove preserve attachment rules', async ({ page }) => {
    await installMessagePortAndroidBridge(page, { recordingSupported: true });
    await mockPage(page);
    let submitted: any;
    let fail = true;
    await page.route('**/api/posts/create', route => {
        submitted = route.request().postDataJSON();
        return route.fulfill({ json: fail ? { code: 422, message: '测试提交失败' } : { code: 200, message: '已发表', data: {} } });
    });
    await page.goto('/thread/123/1');
    await page.getByRole('button', { name: '录音', exact: true }).click();
    await expect.poll(async () => (await bridgeMessages(page)).filter(m => m.type === 'recordingOpen').length).toBe(1);
    await reply(page, 'confirmed', { requestId: 'stale' });
    await expect(page.getByRole('button', { name: '已录音 15.0 秒' })).toHaveCount(0);
    await reply(page, 'confirmed');
    await expect(page.getByRole('button', { name: '已录音 15.0 秒' })).toBeVisible();
    await page.getByRole('button', { name: '已录音 15.0 秒' }).click();
    await expect.poll(async () => (await bridgeMessages(page)).filter(m => m.type === 'recordingOpen').length).toBe(2);
    await reply(page, 'cancelled');
    await page.getByRole('textbox', { name: '正文内容' }).fill('录音正文');
    await page.getByRole('button', { name: '提交', exact: true }).click();
    await expect.poll(() => submitted?.recording_id).toBe(42);
    await expect(page.getByRole('button', { name: '已录音 15.0 秒' })).toBeVisible();
    fail = false;
    await page.getByRole('button', { name: '提交', exact: true }).click();
    await expect(page.getByRole('button', { name: '已录音 15.0 秒' })).toHaveCount(0);
    await expect.poll(async () => (await bridgeMessages(page)).some(m => m.type === 'recordingRelease')).toBe(true);
    await page.getByRole('button', { name: '录音', exact: true }).click();
    await expect.poll(async () => (await bridgeMessages(page)).filter(m => m.type === 'recordingOpen').length).toBe(3);
    await reply(page, 'confirmed');
    await page.getByRole('button', { name: '已录音 15.0 秒' }).click();
    await expect.poll(async () => (await bridgeMessages(page)).filter(m => m.type === 'recordingOpen').length).toBe(4);
    await reply(page, 'removed');
    await expect(page.getByRole('button', { name: '已录音 15.0 秒' })).toHaveCount(0);
});

test('playback is lazy, mutually exclusive, pausable, seekable and stops for native preview', async ({ page }) => {
    let heads = 0;
    await mockPage(page, [recording, { ...recording, id: 43 }]);
    await page.addInitScript(() => {
        HTMLMediaElement.prototype.play = async function () { this.dispatchEvent(new Event('play')); };
        HTMLMediaElement.prototype.pause = function () { this.dispatchEvent(new Event('pause')); };
    });
    await page.route('**/test-recording.m4a', route => {
        if (route.request().method() === 'HEAD') heads++;
        return route.fulfill({ status: 200, contentType: 'audio/mp4', body: '' });
    });
    await page.goto('/thread/123/1');
    const players = page.locator('.recording-post');
    await expect(players).toHaveCount(2);
    expect(heads).toBe(0);
    await players.nth(0).getByRole('button', { name: '播放录音' }).click();
    await expect(players.nth(0).getByRole('button', { name: '暂停' })).toBeVisible();
    expect(heads).toBe(1);
    await players.nth(0).getByRole('slider').fill('7');
    await expect(players.nth(0)).toContainText('0:07 / 0:15');
    await players.nth(0).getByRole('button', { name: '暂停' }).click();
    await expect(players.nth(0).getByRole('button', { name: '播放录音' })).toBeVisible();
    await players.nth(0).getByRole('button', { name: '播放录音' }).click();
    await players.nth(1).getByRole('button', { name: '播放录音' }).click();
    await expect(players.nth(0)).toContainText('0:00 / 0:15');
    await expect(players.nth(1).getByRole('button', { name: '暂停' })).toBeVisible();
    await page.evaluate(() => window.dispatchEvent(new Event('cpttmm:stop-audio')));
    await expect(players.nth(1).getByRole('button', { name: '播放录音' })).toBeVisible();
});

test('404 expires recording while other network failures offer retry', async ({ page }) => {
    await mockPage(page);
    let status = 503;
    await page.route('**/test-recording.m4a', route => route.fulfill({ status, body: '' }));
    await page.goto('/thread/123/1');
    await page.getByRole('button', { name: '播放录音' }).click();
    await expect(page.getByRole('button', { name: '重试', exact: true })).toBeVisible();
    status = 404;
    await page.getByRole('button', { name: '重试', exact: true }).click();
    await expect(page.getByText('录音已失效', { exact: true })).toBeVisible();
});

test('expires while page remains open despite an incorrect device date', async ({ page }) => {
    await page.clock.install({ time: new Date('2040-01-01T00:00:00Z') });
    await mockPage(page, [{ ...recording, expires_at: '2026-10-10T00:00:02Z' }]);
    await page.goto('/thread/123/1');
    await expect(page.getByRole('button', { name: '播放录音' })).toBeVisible();
    await page.clock.fastForward(2500);
    await expect(page.getByText('录音已失效', { exact: true })).toBeVisible();
});

test('deleted replies hide their recording player', async ({ page }) => {
    await mockPage(page, [recording], true);
    await page.goto('/thread/123/1');
    await expect(page.getByText('此贴已被作者删除', { exact: false })).toBeVisible();
    await expect(page.locator('.recording-post')).toHaveCount(0);
});
