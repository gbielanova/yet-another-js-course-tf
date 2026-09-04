import { Locator, Page } from '@playwright/test';
import { HeaderFragment } from './header.fragment';

export class CheckoutPage{
    page: Page;
    header: HeaderFragment;
    checkoutButton: Locator;
    checkoutButtonBillingAddress: Locator;
    cartCheckoutText: Locator;

    postcode: Locator;
    houseNumber: Locator;
    state: Locator;

    paymentMethod: Locator;
    cardNumber: Locator;
    expirationDate: Locator;
    cvv: Locator;
    cardHolder: Locator;
    confirmButton: Locator;
    paymentSuccessMessage: Locator;

    constructor(page: Page){
        this.page = page;
        this.header = new HeaderFragment(this.page);
        this.checkoutButton = page.getByTestId('proceed-3');
        this.checkoutButtonBillingAddress = page.getByTestId('proceed-2');
        this.cartCheckoutText = page.locator('app-login p');
        this.postcode = page.getByTestId('postal_code');
        this.houseNumber = page.getByTestId('house_number');
        this.state = page.getByTestId('state');
        this.paymentMethod = page.getByTestId('payment-method');
        this.cardNumber = page.getByTestId('credit_card_number');
        this.expirationDate = page.getByTestId('expiration_date');
        this.cvv = page.getByTestId('cvv');
        this.cardHolder = page.getByTestId('card_holder_name');
        this.confirmButton = page.getByTestId('finish');
        this.paymentSuccessMessage = page.getByTestId('payment-success-message');
    }

}