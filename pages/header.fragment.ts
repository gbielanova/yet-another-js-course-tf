import { Locator, Page } from "@playwright/test";

export class HeaderFragment{
    page: Page;
    signInButton: Locator;
    navMenuButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.signInButton = page.getByTestId('nav-sign-in');
        this.navMenuButton = page.getByTestId('nav-menu');
    }
}
