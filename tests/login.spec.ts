import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { AccountPage } from '../pages/account.page';
import { ProductPage } from '../pages/product.page';
import { AlertPage } from '../pages/alert.page';
import { CartPage } from '../pages/cart.page';

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

test('can add product to cart', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const alertMessage = new AlertPage(page);
  const cartPage = new CartPage(page);

  await page.goto('https://practicesoftwaretesting.com');

  await homePage.products.filter({hasText: "Slip Joint Pliers"}).click();

  await expect(page).toHaveURL(/https:\/\/practicesoftwaretesting\.com\/product/);
  await expect(productPage.productName).toHaveText(" Slip Joint Pliers ");
  await expect(productPage.productPrice).toHaveText("9.17");

  await productPage.addToCartButton.click();
  await expect (alertMessage.message).toHaveText(' Product added to shopping cart. ');
  await expect(alertMessage.message).toBeHidden({ timeout: 8000 });  
  await expect(productPage.header.cartQuantity).toHaveText('1');

  await productPage.header.cartButton.click();
  await expect(page).toHaveURL('https://practicesoftwaretesting.com/checkout');
  await expect(cartPage.cartItems).toHaveCount(1);
  await expect(cartPage.productTitles.first()).toHaveText("Slip Joint Pliers ");
  await expect(cartPage.checkoutButton).toBeVisible();
});

[
  { sort: 'name,asc'},
  { sort: 'name,desc'},
].forEach(({ sort }) => {
  test(`can perform sorting by ${sort}`, async ({ page }) => {
    const homePage = new HomePage(page);

    await page.goto('https://practicesoftwaretesting.com');
    
    // the select exists before the app has bound its change handler,
    // so wait for the first product load to complete before sorting
    await expect(homePage.products).not.toHaveCount(0);

    await homePage.sortSelect.selectOption(sort);

    await expect(homePage.sortSelect).toHaveValue(sort);

    await expect(async () => {
      const names = (await homePage.products.allTextContents()).map(n => n.trim());
      expect(names.length).toBeGreaterThan(1);

      const expected = [...names].sort((a, b) => a.localeCompare(b));
      if (sort === 'name,desc') expected.reverse();

      expect(names).toEqual(expected);
    }).toPass({ timeout: 10000 });
  });
});