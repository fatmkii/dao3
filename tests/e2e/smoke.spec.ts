import { expect, test } from '@playwright/test';

test('home page renders without browser errors', async ({ page }) => {
    const browserErrors: string[] = [];

    page.on('console', (message) => {
        if (message.type() === 'error') {
            browserErrors.push(message.text());
        }
    });

    page.on('pageerror', (error) => {
        browserErrors.push(error.message);
    });

    const response = await page.goto('/', { waitUntil: 'networkidle' });

    expect(response?.ok()).toBe(true);
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.locator('#app')).not.toHaveText('');
    expect(browserErrors).toEqual([]);
});
