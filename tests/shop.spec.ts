import {expect } from '@playwright/test';
import { PowerTools } from '../enums/categories.enum';
import { SortingOptions } from '../enums/sorting.enum';
import { test } from '../fixtures';

test('can buy a product', async ({ loggedInPage, app }) => {
  // check login finished successfully
  await expect(loggedInPage).toHaveURL('/account');
  await expect(app.accountPage.pageTitle).toHaveText('My account');
  await expect(app.accountPage.header.navMenuButton).toHaveText('Jane Doe');

  // go to test logic
  await app.page.goto('/');
  
  const productName = (await app.homePage.products.first().innerText()).trim();
  const price = (await app.homePage.productPrices.first().innerText()).trim();

  await app.homePage.products.first().click();
  await app.productPage.addToCartButton.click();
  await app.productPage.header.cartButton.click();

  await expect(app.cartPage.productTitles.first()).toHaveText(productName);
  await expect(app.cartPage.productPrices.first()).toHaveText(price);
  await expect(app.cartPage.totalPrice).toHaveText(price);

  await app.cartPage.checkoutButton.click();

  await expect(app.checkoutPage.cartCheckoutText).toContainText('Jane Doe');
  
  await app.checkoutPage.checkoutButtonBillingAddress.click();
  await app.checkoutPage.postcode.fill('123');
  await app.checkoutPage.houseNumber.fill('123');
  await app.checkoutPage.state.fill('Ohio');
  await app.checkoutPage.checkoutButton.click();

  // expiration date: three months from the day the test runs
  const inThreeMonths = new Date();
  inThreeMonths.setDate(1);
  inThreeMonths.setMonth(inThreeMonths.getMonth() + 3);
  const expirationDate = `${String(inThreeMonths.getMonth() + 1).padStart(2, '0')}/${inThreeMonths.getFullYear()}`;

  await app.checkoutPage.paymentMethod.selectOption('credit-card');
  await app.checkoutPage.cardNumber.fill('1111-1111-1111-1111');
  await app.checkoutPage.expirationDate.fill(expirationDate);
  await app.checkoutPage.cvv.fill('111');
  await app.checkoutPage.cardHolder.fill('Jane Doe');
  await app.checkoutPage.confirmButton.click();

  await expect(app.checkoutPage.paymentSuccessMessage).toBeVisible();
});

test('can view product details', async ({ app }) => {
  await app.page.goto('/');

  await app.homePage.combinationPliersHeader.click();

  await expect(app.page).toHaveURL(/\/product\//);

  await expect(app.productPage.productName).toHaveText(' Combination Pliers ');
  await expect(app.productPage.productPrice).toHaveText('14.15');
  await expect(app.productPage.addToCartButton).toBeVisible();
  await expect(app.productPage.addToFavoritesButton).toBeVisible();
});

test('can add product to cart', async ({ app }) => {
  await app.page.goto('/');

  await app.homePage.products.filter({hasText: 'Slip Joint Pliers'}).click();

  await expect(app.page).toHaveURL(/\/product\//);
  await expect(app.productPage.productName).toHaveText(' Slip Joint Pliers ');
  await expect(app.productPage.productPrice).toHaveText('9.17');

  await app.productPage.addToCartButton.click();
  await expect (app.productPage.alert.message).toHaveText(' Product added to shopping cart. ');
  await expect(app.productPage.alert.message).toBeHidden({ timeout: 8000 });  
  await expect(app.productPage.header.cartQuantity).toHaveText('1');

  await app.productPage.header.cartButton.click();
  await expect(app.page).toHaveURL('/checkout');
  await expect(app.cartPage.productTitles).toHaveCount(1);
  await expect(app.cartPage.productTitles.first()).toHaveText('Slip Joint Pliers ');
  await expect(app.cartPage.checkoutButton).toBeVisible();
});

[
  SortingOptions.NameAsc,
  SortingOptions.NameDesc,
].forEach((sort) => {
  test(`can perform sorting by ${sort}`, async ({ app }) => {
    await app.page.goto('/');
    
    // the select exists before the app has bound its change handler,
    // so wait for the first product load to complete before sorting
    await expect(app.homePage.products).not.toHaveCount(0);

    await app.homePage.sortSelect.selectOption(sort);

    await expect(app.homePage.sortSelect).toHaveValue(sort);

    await expect(async () => {
      const names = (await app.homePage.products.allTextContents()).map(n => n.trim());
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
  test(`can perform sorting by ${sort}`, async ({ app }) => {
    await app.page.goto('/');
    
    // the select exists before the app has bound its change handler,
    // so wait for the first product load to complete before sorting
    await expect(app.homePage.products).not.toHaveCount(0);

    await app.homePage.sortSelect.selectOption(sort);

    await expect(app.homePage.sortSelect).toHaveValue(sort);

    await expect(async () => {
      const prices = (await app.homePage.productPrices.allTextContents())
        .map(n => parseFloat(n.replace(/[^\d.]/g, '')));
      expect(prices.length).toBeGreaterThan(1);
      expect(prices).not.toContain(NaN);

      const expected = [...prices].sort((a, b) => a - b);
      if (sort === SortingOptions.PriceDesc) expected.reverse();

      expect(prices).toEqual(expected);
    }).toPass({ timeout: 10000 });
  });
});

test('can filter by category', async ({ app }) => {
  await app.page.goto('/');

  // the filters render before the app has bound their change handlers,
  // so wait for the first product load to complete before filtering
  await expect(app.homePage.products).not.toHaveCount(0);

  await app.homePage.categoryFilter(PowerTools.Sander).check();

  await expect(async () => {
    const names = (await app.homePage.products.allTextContents()).map(n => n.trim());
    expect(names.length).toBeGreaterThan(0);

    for (const name of names) {
      expect(name).toContain(PowerTools.Sander);
    }
  }).toPass({ timeout: 10000 });
});