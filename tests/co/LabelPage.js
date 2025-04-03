export class LabelPage {
	constructor(page) {
		this.page = page;
		this.cellNames = ['id', 'Name', 'Created at'];
		this.idRegEx = /^\d+/;
		this.nameRegEx = /\b[a-zA-Z][a-zA-Z]*\b/;
		this.dateRegEx = /\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)/;
		
		// #/labels/create
		this.newLabelCreateLoc = page.locator('a[href*="#/labels/create"]');
		this.rootDivLoc = page.locator('div.MuiPaper-root.MuiCard-root.RaCreate-card');
		this.labelNameInputLoc = page.getByRole('textbox', { name: 'Name' });
		this.saveButtonLoc = page.getByRole('button', { name: 'Save' });
		this.headerRowLoc = page.locator('tr.RaDatagrid-headerRow');
		this.rowLoc = page.locator('tr.RaDatagrid-clickableRow');
        this.selectAllCheckboxLoc = page.getByRole('checkbox', { name: 'Select all' });
		this.emptyLabelsLoc = page.getByText('No Labels yet.');

		// #/labels/${labelId}
		this.showButtonLoc = page.getByRole('link', { name: 'Show' });
		this.deleteButtonLoc = page.getByRole('button', { name: 'Delete' });
	}

	async openLabelsPage() {
        await this.page.goto('/#/labels');
    }

	async openLabelPage(labelId) {
        await this.page.goto(`/#/labels/${labelId}`);
    }

	async fillLabelFormByData(label) {
        await this.labelNameInputLoc.fill(label);
        await this.saveButtonLoc.click();
    }

	async getSuccessNotification(text) {
        return this.page.getByText(text)
    }

	async getHeaderCellByTextLocator(text) {
        return this.page.getByRole('button', { name: text });
    }

	async getRowCellLoc(rowNumber, cellNumber) {
        return this.rowLoc.nth(rowNumber).locator('td').nth(cellNumber);
    }

	async getRowByTextLocator(text) {
        return this.page.getByRole('row').filter({ hasText: text });
    }
}
