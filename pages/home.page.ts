import { Locator, Page } from '@playwright/test';
import { HeaderFragment } from '../pages/header.fragment';
import { HandTools, Other, PowerTools } from '../enums/categories.enum';

export class HomePage{
    page: Page;
    header: HeaderFragment;
    combinationPliersHeader: Locator;
    products: Locator;
    productPrices: Locator;
    sortSelect: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderFragment(this.page);
        this.combinationPliersHeader = this.page.getByText(' Combination Pliers ');
        this.products = this.page.getByTestId('product-name');
        this.productPrices = this.page.getByTestId('product-price');
        this.sortSelect = this.page.getByTestId('sort');
    }

    categoryFilter(category: HandTools | PowerTools | Other): Locator {
        return this.page.getByRole('checkbox', { name: category, exact: true });
    }
}