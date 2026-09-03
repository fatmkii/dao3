import { expect, test } from '@playwright/test';

function userDataResponse() {
    return {
        code: 200,
        message: 'success',
        data: {
            binggan: {
                nickname: 'loudspeaker-user',
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
    };
}

test('loudspeaker page queries an inclusive seven-day effective-date range', async ({ page }) => {
    const loudspeakerRequests: URL[] = [];

    await page.clock.install({ time: new Date('2026-09-03T04:00:00Z') });
    await page.addInitScript(() => {
        localStorage.setItem('Binggan', 'loudspeaker_owner');
        localStorage.setItem('Token', 'test-token');
        localStorage.setItem('userMyEmoji:loudspeaker_owner', JSON.stringify({
            version: null,
            emojis: [],
        }));
    });

    await page.route('**/api/user/show', (route) => route.fulfill({ json: userDataResponse() }));
    await page.route('**/api/new_loudspeaker_enable', (route) => route.fulfill({
        json: { code: 200, message: 'success', data: true },
    }));
    await page.route('**/api/loudspeaker/show**', (route) => {
        loudspeakerRequests.push(new URL(route.request().url()));
        return route.fulfill({
            json: {
                code: 200,
                message: 'success',
                data: [{
                    id: 1,
                    sub_id: 0,
                    content: '范围内的大喇叭',
                    color: null,
                    thread_id: null,
                    effective_date: '2026-09-03 12:00:00',
                    expire_date: '2026-09-04 12:00:00',
                    created_at: '2026-09-03 11:00:00',
                    is_your_loudspeaker: true,
                }],
            },
        });
    });

    await page.goto('/loudspeaker', { waitUntil: 'domcontentloaded' });

    await expect(page.getByPlaceholder('开始生效日期')).toHaveValue('2026-09-03');
    await expect(page.getByPlaceholder('结束生效日期')).toHaveValue('2026-09-09');
    await expect(page.getByText('范围内的大喇叭')).toBeVisible();
    await expect.poll(() => loudspeakerRequests.length).toBe(1);

    expect(Object.fromEntries(loudspeakerRequests[0].searchParams)).toEqual({
        binggan: 'loudspeaker_owner',
        mode: 'range',
        date_start: '2026-09-03',
        date_end: '2026-09-09',
    });

    await page.getByPlaceholder('开始生效日期').click();
    const septemberDates = page.locator(
        '.n-date-panel-calendar--start [data-n-date]:not(.n-date-panel-date--excluded)',
    );
    await septemberDates.filter({ hasText: /^15$/ }).click();

    await expect(septemberDates.filter({ hasText: /^21$/ })).not.toHaveClass(/n-date-panel-date--disabled/);
    await expect(septemberDates.filter({ hasText: /^22$/ })).toHaveClass(/n-date-panel-date--disabled/);
    await septemberDates.filter({ hasText: /^21$/ }).click();
    await page.getByText('爱乃是盲目～🎵').click();

    await expect(page.getByPlaceholder('开始生效日期')).toHaveValue('2026-09-15');
    await expect(page.getByPlaceholder('结束生效日期')).toHaveValue('2026-09-21');
    await expect.poll(() => loudspeakerRequests.length).toBe(2);

    expect(Object.fromEntries(loudspeakerRequests[1].searchParams)).toEqual({
        binggan: 'loudspeaker_owner',
        mode: 'range',
        date_start: '2026-09-15',
        date_end: '2026-09-21',
    });
});
