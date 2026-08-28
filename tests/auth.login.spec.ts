import { test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

test('Verify successfull login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await page.goto('https://practicesoftwaretesting.com');

  await homePage.header.signInButton.click();

  await loginPage.performLogin("customer@practicesoftwaretesting.com", "welcome01");

  await expect(page).toHaveURL("https://practicesoftwaretesting.com/account");

  await page.context().storageState({ path: authFile });
});
