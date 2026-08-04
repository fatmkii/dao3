import { expect, test, type Page, type Request } from '@playwright/test';

const userData = {
    binggan: {
        admin: 0,
        admin_forums: [],
        nickname: 'android-user',
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
};

async function installAndroidBridge(page: Page, userCustom?: Record<string, unknown>) {
    await page.addInitScript((storedUserCustom) => {
        localStorage.setItem('Binggan', 'android_binggan');
        localStorage.setItem('Token', 'android-token');
        if (storedUserCustom && localStorage.getItem('user_custom') === null) {
            localStorage.setItem('user_custom', JSON.stringify(storedUserCustom));
        }
        (window as Window & { CpttmmAndroid: { postMessage(message: string): void } }).CpttmmAndroid = {
            postMessage() {},
        };
    }, userCustom);
}

async function mockAuthenticatedUser(page: Page) {
    await page.route('**/api/user/show', (route) => route.fulfill({
        json: { code: 200, message: 'success', data: userData },
    }));
}

async function mockUserCenter(page: Page) {
    await mockAuthenticatedUser(page);
    await page.route('**/api/user/show_medals', (route) => route.fulfill({
        json: { code: 200, message: 'success', data: [] },
    }));
    await page.route('**/api/user/show_medal_progress', (route) => route.fulfill({
        json: { code: 200, message: 'success', data: {} },
    }));
}

async function mockThreadPage(page: Page, forumId: number) {
    await mockAuthenticatedUser(page);
    const forum = {
        id: forumId,
        sub_id: 0,
        name: forumId === 419 ? '419版' : '综合版',
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
        id: 123,
        sub_id: 0,
        forum_id: forumId,
        vote_question_id: null,
        gamble_question_id: null,
        crowd_id: null,
        hongbao_id: null,
        nickname: null,
        title: '图片上传测试',
        sub_title: '',
        random_heads_group: 1,
        posts_num: 1,
        title_color: null,
        anti_jingfen: false,
        nissin_date: null,
        has_nissined: false,
        can_battle: false,
        is_delay: false,
        locked_by_coin: 0,
        is_private: false,
        created_at: '2026-08-04 12:00:00',
        updated_at: '2026-08-04 12:00:00',
    };
    const post = {
        id: 1000,
        created_at: '2026-08-04 12:00:00',
        is_deleted: 0,
        thread_id: 123,
        battle_id: null,
        hongbao_id: null,
        floor: 0,
        random_head: 0,
        created_by_admin: 0,
        content: '测试正文',
        nickname: '测试用户',
        is_your_post: false,
        hongbao_data: null,
    };

    await page.route('**/api/forums/', (route) => route.fulfill({
        json: { code: 200, message: 'success', data: [forum] },
    }));
    await page.route('**/api/loudspeaker/show**', (route) => route.fulfill({
        json: { code: 200, message: 'success', data: [] },
    }));
    await page.route('**/api/threads/123**', (route) => route.fulfill({
        json: {
            code: 200,
            message: 'success',
            data: {
                forum_data: forum,
                thread_data: thread,
                posts_data: { currentPage: 1, lastPage: 1, data: [post] },
                your_post_floors: [],
                watermark_string: 'test-watermark',
            },
        },
    }));
}

function imageFile() {
    return {
        name: 'photo.png',
        mimeType: 'image/png',
        buffer: Buffer.from('test-image'),
    };
}

async function selectGeneralSettings(page: Page) {
    await page.goto('/user-center', { waitUntil: 'domcontentloaded' });
    await page.getByText('一般设定', { exact: true }).click();
}

function storedUserCustom(page: Page) {
    return page.evaluate(() => JSON.parse(localStorage.getItem('user_custom') ?? '{}'));
}

function multipartText(request: Request) {
    return request.postDataBuffer()?.toString('utf8') ?? '';
}

test.describe('image host preferences', () => {
    test('migrates the legacy host to web and initializes Android to ImgIMG', async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('user_custom', JSON.stringify({ imgHost: 'imgimg' }));
        });

        await page.goto('/', { waitUntil: 'domcontentloaded' });

        await expect.poll(() => storedUserCustom(page)).toMatchObject({
            imgHostWeb: 'imgimg',
            imgHostAndroid: 'imgimg',
        });
        expect((await storedUserCustom(page)).imgHost).toBeUndefined();
    });

    test('Android shows only its two hosts and persists independently', async ({ page }) => {
        await installAndroidBridge(page, { imgHostWeb: 'freeimage' });
        await mockUserCenter(page);
        await selectGeneralSettings(page);

        const hostSelect = page.getByTestId('image-host-select');
        await expect(hostSelect).toContainText('imgimg');
        await hostSelect.click();
        const options = page.locator('.n-base-select-option');
        await expect(options).toHaveCount(2);
        await expect(options.filter({ hasText: 'picui' })).toBeVisible();
        await expect(options.filter({ hasText: 'imgimg' })).toBeVisible();
        await options.filter({ hasText: 'picui' }).click();

        await expect.poll(() => storedUserCustom(page)).toMatchObject({
            imgHostWeb: 'freeimage',
            imgHostAndroid: 'picui',
        });
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.getByText('一般设定', { exact: true }).click();
        await expect(page.getByTestId('image-host-select')).toContainText('picui');
    });

    test('web shows four hosts and leaves the Android preference unchanged', async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('Binggan', 'web_binggan');
            localStorage.setItem('Token', 'web-token');
            if (localStorage.getItem('user_custom') === null) {
                localStorage.setItem('user_custom', JSON.stringify({
                    imgHostWeb: 'imgbb',
                    imgHostAndroid: 'imgimg',
                }));
            }
        });
        await mockUserCenter(page);
        await selectGeneralSettings(page);

        const hostSelect = page.getByTestId('image-host-select');
        await expect(hostSelect).toContainText('imgbb');
        await hostSelect.click();
        const options = page.locator('.n-base-select-option');
        await expect(options).toHaveCount(4);
        await expect(options).toContainText(['(推荐)imgbb', 'Freeimage', 'imgimg', 'picui']);
        await options.filter({ hasText: 'picui' }).click();

        await expect.poll(() => storedUserCustom(page)).toMatchObject({
            imgHostWeb: 'picui',
            imgHostAndroid: 'imgimg',
        });
    });
});

test.describe('Android image upload', () => {
    for (const host of [
        { preference: 'picui', endpoint: 'https://picui.cn/api/v1/upload', url: 'https://cdn.test/picui.png' },
        { preference: 'imgimg', endpoint: 'https://imgimg.cc/api/v1/upload', url: 'https://cdn.test/imgimg.png' },
    ] as const) {
        test(`uploads multipart to ${host.preference} and inserts at the saved selection`, async ({ page }) => {
            await installAndroidBridge(page, { imgHostWeb: 'imgbb', imgHostAndroid: host.preference });
            await mockThreadPage(page, 1);
            let uploadBody = '';
            await page.route(host.endpoint, (route) => {
                uploadBody = multipartText(route.request());
                return route.fulfill({
                    json: { status: true, message: 'success', data: { links: { url: host.url } } },
                });
            });
            await page.goto('/thread/123/1', { waitUntil: 'domcontentloaded' });

            const content = page.locator('#content-input');
            await content.fill('before after');
            await content.evaluate((element) => {
                const textarea = element as HTMLTextAreaElement;
                textarea.focus();
                textarea.setSelectionRange(7, 7);
                textarea.dispatchEvent(new Event('select', { bubbles: true }));
            });
            await page.locator('input[type="file"][accept="image/*"]').setInputFiles(imageFile());

            await expect(content).toHaveValue(`before <img src='${host.url}' />after`);
            expect(uploadBody).toContain('name="file"');
            expect(uploadBody).toContain('photo.png');
            await expect(content).toBeFocused();
        });
    }

    test('forum 419 uses the authenticated backend without free hosts or PUP', async ({ page }) => {
        await installAndroidBridge(page, { imgHostWeb: 'imgbb', imgHostAndroid: 'picui' });
        await mockThreadPage(page, 419);
        const freeHostRequests: string[] = [];
        page.on('request', (request) => {
            if (/picui\.cn|imgimg\.cc|upload\.js|pup\.js/.test(request.url())) {
                freeHostRequests.push(request.url());
            }
        });
        let backendBody = '';
        await page.route('**/api/img_upload', (route) => {
            backendBody = multipartText(route.request());
            return route.fulfill({
                json: { code: 200, message: 'success', data: { file_url: 'https://self.test/419.png' } },
            });
        });
        await page.goto('/thread/123/1', { waitUntil: 'domcontentloaded' });

        const content = page.locator('#content-input');
        await content.fill('419:');
        await page.locator('input[type="file"][accept="image/*"]').setInputFiles(imageFile());

        await expect(content).toHaveValue("419:<img src='https://self.test/419.png' />");
        expect(backendBody).toContain('name="binggan"');
        expect(backendBody).toContain('android_binggan');
        expect(backendBody).toContain('name="forum_id"');
        expect(backendBody).toContain('419');
        expect(backendBody).toContain('name="thread_id"');
        expect(backendBody).toContain('123');
        expect(backendBody).toContain('name="mode"');
        expect(backendBody).toContain('img');
        expect(freeHostRequests).toEqual([]);
        await expect(page.locator('#image-upload-js')).toHaveCount(0);
    });

    test('cancelled and failed uploads do not change the body', async ({ page }) => {
        await installAndroidBridge(page, { imgHostWeb: 'imgbb', imgHostAndroid: 'picui' });
        await mockThreadPage(page, 1);
        await page.route('https://picui.cn/api/v1/upload', (route) => route.fulfill({
            json: { status: false, message: 'upload failed', data: {} },
        }));
        await page.goto('/thread/123/1', { waitUntil: 'domcontentloaded' });

        const content = page.locator('#content-input');
        const fileInput = page.locator('input[type="file"][accept="image/*"]');
        await content.fill('unchanged');
        await fileInput.setInputFiles([]);
        await expect(content).toHaveValue('unchanged');
        await fileInput.setInputFiles(imageFile());
        await expect(page.getByText('upload failed', { exact: true })).toBeVisible();
        await expect(content).toHaveValue('unchanged');
    });
});
