import { BasePage } from "./BasePage";

export class LabelPage extends BasePage {
	constructor(page) {
		super(page);
		this.page = page;
		this.pageName = 'labelPage';
		this.cellNames = ['id', 'Name', 'Created at'];

		this.labelNameInputLoc = page.getByRole('textbox', { name: 'Name' });
		this.emptyLabelsLoc = page.getByText('No Labels yet.');
	}

	async fillLabelFormByData(label) {
        await this.labelNameInputLoc.fill(label);
        await this.saveButtonLoc.click();
    }
}
