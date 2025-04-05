export class BasePage {

    static idRegEx = /^\d+/;
    static nameRegEx = /\b[a-zA-Z][a-zA-Z]*\b/;
    static dateRegEx = /\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)/;
    static userSlug = '#/users/';
    static taskStatusSlug = '#/task_statuses/';
    static labelSlug = '#/labels/';
    static taskSlug = '#/tasks/';
    static loginPage = '#/login/'

    constructor(page) {
        this.page = page;
        this.rootLoc = page.locator('div.MuiPaper-root.MuiCard-root.RaCreate-card');
        this.showButtonLoc = page.getByRole('link', { name: 'Show' });
        this.saveButtonLoc = page.getByRole('button', { name: 'Save' });
        this.deleteButtonLoc = page.getByRole('button', { name: 'Delete' });
        this.headerRowLoc = page.locator('tr.RaDatagrid-headerRow');
        this.rowLoc = page.locator('tr.RaDatagrid-clickableRow');
        this.selectAllCheckboxLoc = page.getByRole('checkbox', { name: 'Select all' });
    }

    static async openPage(page, pageName, id) {
        let url = '';
        switch (pageName) {
            case 'loginPage':
                url = `/${this.loginPage}`;
                break;
            case 'userPage':
                url = `/${this.userSlug}`;
                break;
            case 'taskStatusesPage':
                url = `/${this.taskStatusSlug}`;
                break;
            case 'labelPage':
                url = `/${this.labelSlug}`;
                break;
            case 'taskPage':
                url = `/${this.taskSlug}`;
                break;
            default:
                url = '/#/'
                break;
        };

        let resUrl = id ? `${url}${id}` : url;

        await page.goto(resUrl)
    }

    async getCreateEntityLoc(pageName) {
        let slug = '';
        switch (pageName) {
            case 'userPage':
                slug = BasePage.userSlug;
                break;
            case 'taskStatusesPage':
                slug = BasePage.taskStatusSlug;
                break;
            case 'labelPage':
                slug = BasePage.labelSlug;
                break;
            case 'taskPage':
                slug = BasePage.taskSlug;
                break;
            default:
                slug = '/#/'
                break;
        };

        return this.page.locator(`a[href*="${slug}create"]`);
    }

    static async getHeaderCellByTextLocator(page, text) {
        return page.getByRole('button', { name: text });
    }

    static getRowLocator(page) {
        return page.locator('tr.RaDatagrid-clickableRow');
    }

    static async getRowCellLoc(page, rowNum, cellNum) {
        const rowLoc = this.getRowLocator(page);
        return rowLoc.nth(rowNum).locator('td').nth(cellNum);
    }

    static async getRowByTextLoc(page, text) {
        return page.getByRole('row').filter({ hasText: text });
    }
}
