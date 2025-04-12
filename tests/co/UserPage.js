import { BasePage } from "./BasePage";

export class UserPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.pageName = 'userPage';
        this.cellNames = ['id', 'Email', 'First name', 'Last name', 'Created at'];

        this.emailRegEx = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i;

        this.emptyUsersLoc = page.getByText('No Users yet');

        this.createNewUserEmailInputLoc = page.getByRole('textbox', { name: 'Email' });
        this.createNewUserFNameInputLoc = page.getByRole('textbox', { name: 'First name' });
        this.createNewUserLNameInputLoc = page.getByRole('textbox', { name: 'Last name' });
        this.validateEmailFieldLoc = page.locator('div.ra-input-email').filter({ hasText: 'Incorrect email format'})
    }

    async fillUserFormByData(user) {
        await this.createNewUserEmailInputLoc.fill(user.email);
        await this.createNewUserFNameInputLoc.fill(user.firstName);
        await this.createNewUserLNameInputLoc.fill(user.lastName);
        await this.saveButtonLoc.click();
    }
}
