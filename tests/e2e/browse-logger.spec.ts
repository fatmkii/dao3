import { expect, test, type Page } from '@playwright/test';

const threadId = 123;

const forum = {
    id: 1,
    sub_id: 0,
    name: '浏览进度测试岛',
    description: 'test forum',
    status: 1,
    is_anonymous: 0,
    accessible_coin: 0,
    is_nissin: 0,
    banners: [],
    default_heads: 0,
    deleted_at: null,
};

const thread = {
    id: threadId,
    sub_id: 0,
    forum_id: forum.id,
    vote_question_id: null,
    gamble_question_id: null,
    crowd_id: null,
    hongbao_id: null,
    nickname: '测试用户',
    title: '浏览进度测试主题',
    sub_title: '',
    random_heads_group: 1,
    posts_num: 399,
    title_color: null,
    anti_jingfen: false,
    nissin_date: null,
    has_nissined: false,
    can_battle: false,
    is_delay: false,
    locked_by_coin: 0,
    is_private: false,
    created_at: '2026-09-04 12:00:00',
    updated_at: '2026-09-04 12:00:00',
};

function post(floor: number) {
    return {
        id: 1000 + floor,
        created_at: '2026-09-04 12:00:00',
        is_deleted: 0,
        thread_id: threadId,
        battle_id: null,
        hongbao_id: null,
        floor,
        random_head: 0,
        created_by_admin: 0,
        content: `浏览进度测试楼层 ${floor}`,
        nickname: '测试用户',
        is_your_post: false,
        hongbao_data: null,
    };
}

async function mockBrowseLoggerApis(page: Page) {
    await page.route('**/api/user/show', (route) => route.fulfill({
        json: {
            code: 200,
            message: 'success',
            data: {
                binggan: {
                    nickname: '测试用户',
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
                my_emoji_version: null,
                emoji_excluded: [],
            },
        },
    }));
    await page.route('**/api/forums/**', async (route) => {
        const path = new URL(route.request().url()).pathname;

        if (path === '/api/forums/') {
            await route.fulfill({ json: { code: 200, message: 'success', data: [forum] } });
            return;
        }

        await route.fulfill({
            json: {
                code: 200,
                message: 'success',
                data: {
                    forum_data: forum,
                    threads_data: { currentPage: 1, lastPage: 1, data: [thread] },
                    subtitles_exclude: null,
                },
            },
        });
    });
    await page.route(`**/api/threads/${threadId}**`, (route) => route.fulfill({
        json: {
            code: 200,
            message: 'success',
            data: {
                forum_data: forum,
                thread_data: thread,
                posts_data: {
                    currentPage: 2,
                    lastPage: 2,
                    data: Array.from({ length: 200 }, (_, index) => post(index + 200)),
                },
                your_post_floors: [],
                watermark_string: 'test-watermark',
            },
        },
    }));
    await page.route('**/api/loudspeaker/show**', (route) => route.fulfill({
        json: { code: 200, message: 'success', data: [] },
    }));
}

async function initializeStorage(page: Page, floor: number) {
    await page.addInitScript(({ id, initialFloor }) => {
        localStorage.setItem('Binggan', 'test_binggan');
        localStorage.setItem('Token', 'test-token');
        localStorage.setItem('userMyEmoji:test_binggan', JSON.stringify({
            version: null,
            emojis: [],
        }));
        if (!localStorage.getItem('browseLogger')) {
            localStorage.setItem('browseLogger', JSON.stringify({
                [id]: { expireTime: Date.now() + 86_400_000, floor: initialFloor },
            }));
        }
    }, { id: threadId, initialFloor: floor });
}

test('continue reading uses the latest progress after a refresh', async ({ page }) => {
    await initializeStorage(page, 210);
    await mockBrowseLoggerApis(page);

    await page.goto(`/forum/${forum.id}`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /210楼/ }).click();

    await expect(page).toHaveURL(new RegExp(`/thread/${threadId}/2$`));
    await expect(page.getByText('№210', { exact: true })).toBeInViewport();

    await page.evaluate(({ id }) => {
        localStorage.setItem('browseLogger', JSON.stringify({
            [id]: { expireTime: Date.now() + 86_400_000, floor: 260 },
        }));
    }, { id: threadId });
    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(new RegExp(`/thread/${threadId}/2$`));
    await expect(page.getByText('№260', { exact: true })).toBeInViewport();
});

test('an explicit floor hash remains stable after a refresh', async ({ page }) => {
    await initializeStorage(page, 260);
    await mockBrowseLoggerApis(page);

    await page.goto(`/thread/${threadId}/2#f_220`, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(new RegExp(`/thread/${threadId}/2#f_220$`));
    await expect(page.getByText('№220', { exact: true })).toBeInViewport();

    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(new RegExp(`/thread/${threadId}/2#f_220$`));
    await expect(page.getByText('№220', { exact: true })).toBeInViewport();
});
