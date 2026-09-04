import path from 'path';
import { test, expect } from '../fixtures';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

test('Verify successfull login', { tag: '@auth' }, async ({ app }) => {
  await app.page.goto('/');

  await app.homePage.header.signInButton.click();

  await app.loginPage.performLogin('customer@practicesoftwaretesting.com', 'welcome01');

  // the token is written to localStorage only once the login request resolves,
  // so wait for the redirect before capturing the session
  await expect(app.page).toHaveURL('/account');

  await app.page.context().storageState({ path: authFile });
});
