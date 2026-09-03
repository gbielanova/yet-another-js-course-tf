import { test as base, Page } from '@playwright/test';
import { App } from './pages/app';

// Declare the types of your fixtures.
type MyFixtures = {
    loggedInPage: Page;
    app : App;
};

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
    loggedInPage: async ({ app }, use) => {
    // Set up the fixture.

    await app.page.goto('/');
    await app.homePage.header.signInButton.click();
    await app.loginPage.performLogin('customer@practicesoftwaretesting.com', 'welcome01');

    // Use the fixture value in the test.
    await use(app.page);

    // Clean up the fixture.
  },
    app: async ({page}, use) => {
    const app = new App(page);
    await use(app);
  },
});

export { expect } from '@playwright/test';
