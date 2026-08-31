import { Locator, Page } from "@playwright/test";

export class AlertPage{
    page: Page;
    message: Locator;

    constructor(page: Page) {
        this.page = page;
        this.message = this.page.locator(".toast-message");
    }
}