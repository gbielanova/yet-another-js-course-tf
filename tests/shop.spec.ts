import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { AccountPage } from '../pages/account.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { PowerTools } from '../enums/categories.enum';
import { SortingOptions } from '../enums/sorting.enum';

test('can login', async ({ page }) => {
  const accountPage = new AccountPage(page);

  await page.goto('/account');
  
  await expect(accountPage.pageTitle).toHaveText('My account');
  await expect(accountPage.header.navMenuButton).toHaveText('Jane Doe');
});

test('can view product details', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);

  await page.goto('/');

  await homePage.combinationPliersHeader.click();

  await expect(page).toHaveURL(/\/product\//);

  await expect(productPage.productName).toHaveText(' Combination Pliers ');
  await expect(productPage.productPrice).toHaveText('14.15');
  await expect(productPage.addToCartButton).toBeVisible();
  await expect(productPage.addToFavoritesButton).toBeVisible();
});

test('can add product to cart', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);

  await page.goto('/');

  await homePage.products.filter({hasText: 'Slip Joint Pliers'}).click();

  await expect(page).toHaveURL(/\/product\//);
  await expect(productPage.productName).toHaveText(' Slip Joint Pliers ');
  await expect(productPage.productPrice).toHaveText('9.17');

  await productPage.addToCartButton.click();
  await expect (productPage.alert.message).toHaveText(' Product added to shopping cart. ');
  await expect(productPage.alert.message).toBeHidden({ timeout: 8000 });  
  await expect(productPage.header.cartQuantity).toHaveText('1');

  await productPage.header.cartButton.click();
  await expect(page).toHaveURL('/checkout');
  await expect(cartPage.productTitles).toHaveCount(1);
  await expect(cartPage.productTitles.first()).toHaveText('Slip Joint Pliers ');
  await expect(cartPage.checkoutButton).toBeVisible();
});

[
  SortingOptions.NameAsc,
  SortingOptions.NameDesc,
].forEach((sort) => {
  test(`can perform sorting by ${sort}`, async ({ page }) => {
    const homePage = new HomePage(page);

    await page.goto('/');
    
    // the select exists before the app has bound its change handler,
    // so wait for the first product load to complete before sorting
    await expect(homePage.products).not.toHaveCount(0);

    await homePage.sortSelect.selectOption(sort);

    await expect(homePage.sortSelect).toHaveValue(sort);

    await expect(async () => {
      const names = (await homePage.products.allTextContents()).map(n => n.trim());
      expect(names.length).toBeGreaterThan(1);

      const expected = [...names].sort((a, b) => a.localeCompare(b));
      if (sort === SortingOptions.NameDesc) expected.reverse();

      expect(names).toEqual(expected);
    }).toPass({ timeout: 10000 });
  });
});

[
  SortingOptions.PriceAsc,
  SortingOptions.PriceDesc,
].forEach((sort) => {
  test(`can perform sorting by ${sort}`, async ({ page }) => {
    const homePage = new HomePage(page);

    await page.goto('/');
    
    // the select exists before the app has bound its change handler,
    // so wait for the first product load to complete before sorting
    await expect(homePage.products).not.toHaveCount(0);

    await homePage.sortSelect.selectOption(sort);

    await expect(homePage.sortSelect).toHaveValue(sort);

    await expect(async () => {
      const prices = (await homePage.productPrices.allTextContents())
        .map(n => parseFloat(n.replace(/[^\d.]/g, '')));
      expect(prices.length).toBeGreaterThan(1);
      expect(prices).not.toContain(NaN);

      const expected = [...prices].sort((a, b) => a - b);
      if (sort === SortingOptions.PriceDesc) expected.reverse();

      expect(prices).toEqual(expected);
    }).toPass({ timeout: 10000 });
  });
});

test('can filter by category', async ({ page }) => {
  const homePage = new HomePage(page);

  await page.goto('/');

  // the filters render before the app has bound their change handlers,
  // so wait for the first product load to complete before filtering
  await expect(homePage.products).not.toHaveCount(0);

  await homePage.categoryFilter(PowerTools.Sander).check();

  await expect(async () => {
    const names = (await homePage.products.allTextContents()).map(n => n.trim());
    expect(names.length).toBeGreaterThan(0);

    for (const name of names) {
      expect(name).toContain(PowerTools.Sander);
    }
  }).toPass({ timeout: 10000 });
});