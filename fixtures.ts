import { test as base } from '@playwright/test';
import { App } from './pages/app';
import path from 'path';

const authFile = path.join(__dirname, 'playwright/.auth/user.json');

// Declare the types of your fixtures.
type MyFixtures = {
    app: App;
    loggedInApp: App;
};

// This new 'test' can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
    app: async ({ page }, use) => {
        const app = new App(page);
        await use(app);
    },

    // Reuses the session saved by the 'perform-login' project instead of
    // signing in through the UI. Runs in its own context, so tests that ask
    // only for 'app' stay anonymous.
    loggedInApp: async ({ browser, baseURL }, use) => {
        const context = await browser.newContext({ storageState: authFile, baseURL });
        const app = new App(await context.newPage());

        await use(app);

        await context.close();
    },
});

export { expect } from '@playwright/test';
