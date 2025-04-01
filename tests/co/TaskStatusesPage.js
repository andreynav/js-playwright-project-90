export class TaskStatusesPage {
    constructor(page) {
        this.page = page;
        this.idRegEx = /^\d+/;
        this.nameRegEx = /\b[A-Z][a-z]+\b/;
        this.slugRegEx = /\b[a-zA-Z]+(?:_[a-zA-Z]+)*\b|\b[a-z]+(?:[A-Z][a-z]*)+\b/;
        this.dateRegEx = /\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)/;
        this.cellNames = ['id', 'Name', 'Slug', 'Created at'];

        // #/task_statuses
        this.newTaskStatusCreateLoc = page.locator('a[href*="#/task_statuses/create"]');
        this.headerRowLoc = page.locator('tr.RaDatagrid-headerRow');
        this.rowLoc = page.locator('tr.RaDatagrid-clickableRow');
        this.selectAllCheckboxLoc = page.getByRole('checkbox', { name: 'Select all' });
        this.emptyStatusesLoc = page.getByText('No Task statuses yet.');

        // #/task_statuses/create
        this.rootDivLoc = page.locator('div.MuiPaper-root.MuiCard-root.RaCreate-card');
        this.statusNameInputLoc = page.getByRole('textbox', { name: 'Name' });
        this.statusSlugInputLoc = page.getByRole('textbox', { name: 'Slug' });
        this.saveButtonLoc = page.getByRole('button', { name: 'Save' });

        // #/task_statuses/{statusId}
        this.showButtonLoc = page.getByRole('link', { name: 'Show' });
        this.deleteButtonLoc = page.getByRole('button', { name: 'Delete' });

    }

    async openTaskStatusesPage() {
        await this.page.goto('/#/task_statuses');
    }

    async openTaskStatusPage(statusId) {
        await this.page.goto(`/#/task_statuses/${statusId}`);
    }

    async fillTaskStatusFormByData(status) {
        await this.statusNameInputLoc.fill(status.name);
        await this.statusSlugInputLoc.fill(status.slug);
        await this.saveButtonLoc.click();
    }

    async getSuccessNotification(text) {
        return this.page.getByText(text)
    }

    async getRowCellLoc(rowNumber, cellNumber) {
        return this.rowLoc.nth(rowNumber).locator('td').nth(cellNumber);
    }

    async getHeaderCellByTextLocator(text) {
        return this.page.getByRole('button', { name: text });
    }

    async getRowByTextLocator(text) {
        return this.page.getByRole('row').filter({ hasText: text });
    }
}
