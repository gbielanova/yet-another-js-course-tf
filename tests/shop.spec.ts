import { test, expect } from '../fixtures';
import { PowerTools } from '../enums/categories.enum';
import { SortingOptions } from '../enums/sorting.enum';
import { getExpirationDate } from '../utils/date.util';

test('can buy a product', { tag: '@auth' }, async ({ loggedInApp }) => {
  // the saved session is restored, so /account is reachable without signing in
  await loggedInApp.page.goto('/account');

  await expect(loggedInApp.page).toHaveURL('/account');
  await expect(loggedInApp.accountPage.pageTitle).toHaveText('My account');
  await expect(loggedInApp.accountPage.header.navMenuButton).toHaveText('Jane Doe');

  // go to test logic
  await loggedInApp.page.goto('/');
  
  const productName = (await loggedInApp.homePage.products.first().innerText()).trim();
  const price = (await loggedInApp.homePage.productPrices.first().innerText()).trim();

  await loggedInApp.homePage.products.first().click();
  await loggedInApp.productPage.addToCartButton.click();
  await loggedInApp.productPage.header.cartButton.click();

  await expect(loggedInApp.cartPage.productTitles.first()).toHaveText(productName);
  await expect(loggedInApp.cartPage.productPrices.first()).toHaveText(price);
  await expect(loggedInApp.cartPage.totalPrice).toHaveText(price);

  await loggedInApp.cartPage.checkoutButton.click();

  await expect(loggedInApp.checkoutPage.cartCheckoutText).toContainText('Jane Doe');
  
  await loggedInApp.checkoutPage.checkoutButtonBillingAddress.click();
  await loggedInApp.checkoutPage.postcode.fill('123');
  await loggedInApp.checkoutPage.houseNumber.fill('123');
  await loggedInApp.checkoutPage.state.fill('Ohio');
  await loggedInApp.checkoutPage.checkoutButton.click();

  await loggedInApp.checkoutPage.paymentMethod.selectOption('credit-card');
  await loggedInApp.checkoutPage.cardNumber.fill('1111-1111-1111-1111');
  await loggedInApp.checkoutPage.expirationDate.fill(getExpirationDate(3));
  await loggedInApp.checkoutPage.cvv.fill('111');
  await loggedInApp.checkoutPage.cardHolder.fill('Jane Doe');
  await loggedInApp.checkoutPage.confirmButton.click();

  await expect(loggedInApp.checkoutPage.paymentSuccessMessage).toBeVisible();
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
  const productName = 'Slip Joint Pliers';
  const productPrice = '9.17'

  await app.page.goto('/');

  await app.homePage.products.filter({hasText: productName}).click();

  await expect(app.page).toHaveURL(/\/product\//);
  await expect(app.productPage.productName).toContainText(productName);
  await expect(app.productPage.productPrice).toHaveText(productPrice);

  await app.productPage.addToCartButton.click();
  await expect (app.productPage.alert.message).toHaveText(' Product added to shopping cart. ');
  await expect(app.productPage.alert.message).toBeHidden({ timeout: 8000 });  
  await expect(app.productPage.header.cartQuantity).toHaveText('1');

  await app.productPage.header.cartButton.click();
  await expect(app.page).toHaveURL('/checkout');
  await expect(app.cartPage.productTitles).toHaveCount(1);
  await expect(app.cartPage.productTitles.first()).toContainText(productName);
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