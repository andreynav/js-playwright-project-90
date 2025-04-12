import { BasePage } from "./BasePage";
export class TaskStatusesPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.pageName = 'taskStatusesPage';
        this.cellNames = ['id', 'Name', 'Slug', 'Created at'];

        this.slugRegEx = /\b[a-zA-Z]+(?:_[a-zA-Z]+)*\b|\b[a-z]+(?:[A-Z][a-z]*)+\b/;

        this.emptyStatusesLoc = page.getByText('No Task statuses yet.');
        this.statusNameInputLoc = page.getByRole('textbox', { name: 'Name' });
        this.statusSlugInputLoc = page.getByRole('textbox', { name: 'Slug' });
    }

    async fillTaskStatusFormByData(status) {
        await this.statusNameInputLoc.fill(status.name);
        await this.statusSlugInputLoc.fill(status.slug);
        await this.saveButtonLoc.click();
    }
}
