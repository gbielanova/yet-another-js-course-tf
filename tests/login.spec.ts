import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { AccountPage } from '../pages/account.page';
import { ProductPage } from '../pages/product.page';

test('can login', async ({ page }) => {
  const accountPage = new AccountPage(page);

  await page.goto('https://practicesoftwaretesting.com/account');
  
  await expect(accountPage.pageTitle).toHaveText("My account");
  await expect(accountPage.header.navMenuButton).toHaveText("Jane Doe");
});

test('can view product details', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);

  await page.goto('https://practicesoftwaretesting.com');

  await homePage.combinationPliersHeader.click();

  await expect(page).toHaveURL(/https:\/\/practicesoftwaretesting\.com\/product/);

  await expect(productPage.productName).toHaveText(" Combination Pliers ");
  await expect(productPage.productPrice).toHaveText("14.15");
  await expect(productPage.addToCartButton).toBeVisible();
  await expect(productPage.addToFavoritesButton).toBeVisible();
});