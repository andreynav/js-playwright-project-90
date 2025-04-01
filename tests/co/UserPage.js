export class UserPage {
    constructor(page) {
        this.page = page;

        this.cellNames = ['id', 'Email', 'First name', 'Last name', 'Created at'];
        this.idRegEx = /^\d+/;
        this.emailRegEx = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i;
        this.nameRegEx = /\b[A-Z][a-z]+\b/;
        this.dateRegEx = /\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)/;

        this.rootDivLoc = page.locator('div.MuiPaper-root.MuiCard-root.RaCreate-card');
        this.userTabLoc = page.locator('ul>a[href*="#/users"]');
        this.headerRowLoc = page.locator('tr.RaDatagrid-headerRow');
        this.rowLoc = page.locator('tr.RaDatagrid-clickableRow');
        this.selectAllCheckboxLoc = page.getByRole('checkbox', { name: 'Select all' });
        this.userSelectedNotificationloc = page.getByRole('heading', { name: 'items selected' });
        this.emptyUsersLoc = page.getByText('No Users yet');

        this.fillUserFormByDataButtonTabLocator = page.locator('a[href*="#/users/create"]');
        this.createNewUserEmailInputLoc = page.getByRole('textbox', { name: 'Email' });
        this.createNewUserFNameInputLoc = page.getByRole('textbox', { name: 'First name' });
        this.createNewUserLNameInputLoc = page.getByRole('textbox', { name: 'Last name' });
        this.saveButtonLoc = page.getByRole('button', { name: 'Save' });
        this.deleteButtonLoc = page.getByRole('button', { name: 'Delete' });
        this.validateEmailFieldLoc = page.locator('div.ra-input-email').filter({ hasText: 'Incorrect email format'})

        this.showButtonLoc = page.getByRole('link', { name: 'Show' });
    }

    async openUsersPage() {
        await this.page.goto('/#/users');
    }

    async openUserPage(userId) {
        await this.page.goto(`/#/users/${userId}`);
    }

    async selectUserTab() {
        await this.userTabLoc.click();
    }

    async getRowByTextLocator(text) {
        return this.page.getByRole('row').filter({ hasText: text });
    }

    async getHeaderCellByTextLocator(text) {
        return this.page.getByRole('button', { name: text });
    }

    async fillUserFormByData(user) {
        await this.createNewUserEmailInputLoc.fill(user.email);
        await this.createNewUserFNameInputLoc.fill(user.firstName);
        await this.createNewUserLNameInputLoc.fill(user.lastName);
        await this.saveButtonLoc.click();
    }

    async getSuccessNotification(text) {
        return this.page.getByText(text)
    }

    async getRowCellLoc(rowNumber, cellNumber) {
        return this.rowLoc.nth(rowNumber).locator('td').nth(cellNumber);
    }
}
