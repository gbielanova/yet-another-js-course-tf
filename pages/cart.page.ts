import { Locator, Page } from '@playwright/test';
import { HeaderFragment } from './header.fragment';

export class CartPage{
    page: Page;
    header: HeaderFragment;
    productTitles: Locator;
    productPrices: Locator;
    totalPrice: Locator;
    checkoutButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.header = new HeaderFragment(this.page);
        this.productTitles = page.getByTestId('product-title');
        this.productPrices = page.getByTestId('product-price');
        this.checkoutButton = page.getByTestId('proceed-1');
        this.totalPrice = page.getByTestId('cart-total');
    }

}