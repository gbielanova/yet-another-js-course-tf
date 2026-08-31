import { Locator, Page } from "@playwright/test";
import { HeaderFragment } from "./header.fragment";

export class ProductPage{
    page: Page;
    header: HeaderFragment;
    productName: Locator;
    productPrice: Locator;
    addToCartButton: Locator;
    addToFavoritesButton: Locator;
    

    constructor(page: Page){
        this.page = page;
        this.header = new HeaderFragment(this.page);
        this.productName = page.getByTestId('product-name');
        this.productPrice = page.getByTestId('unit-price');
        this.addToCartButton = page.getByTestId('add-to-cart');
        this.addToFavoritesButton = page.getByTestId('add-to-favorites');
    }

}