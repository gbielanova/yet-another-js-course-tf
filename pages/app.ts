import { Page } from '@playwright/test';
import { AccountPage } from './account.page';
import { LoginPage } from './login.page';
import { CartPage } from './cart.page';
import { HomePage } from './home.page';
import { ProductPage } from './product.page';
import { CheckoutPage } from './checkout.page';

export class App {
    accountPage: AccountPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    homePage: HomePage;
    loginPage: LoginPage;
    productPage: ProductPage;
    page: Page;

    constructor(page: Page) {
        this.accountPage = new AccountPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
        this.homePage = new HomePage(page);
        this.loginPage = new LoginPage(page);
        this.productPage = new ProductPage(page);
        this.page = page;
    }
}