import { defineConfig, devices } from '@playwright/test';

const mapLocalhostToHost = process.env.PLAYWRIGHT_MAP_LOCALHOST_TO_HOST === 'true';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30000,
    expect: {
        timeout: 10000,
    },
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:80',
        launchOptions: {
            args: mapLocalhostToHost
                ? ['--host-resolver-rules=MAP localhost host.docker.internal']
                : [],
        },
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
