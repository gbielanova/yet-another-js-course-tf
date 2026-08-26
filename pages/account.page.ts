import { Locator, Page } from "@playwright/test";
import { HeaderFragment } from "./header.fragment";

export class AccountPage{
    page: Page;
    header: HeaderFragment;
    pageTitle: Locator;

    constructor(page: Page){
        this.page = page;
        this.header = new HeaderFragment(this.page);
        this.pageTitle = page.getByTestId('page-title');
    }
}