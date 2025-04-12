import { BasePage } from "./BasePage";

export class LabelPage extends BasePage {
	constructor(page) {
		super(page);
		this.page = page;
		this.pageName = "labelPage";
		this.cellNames = ["id", "Name", "Created at"];

		this.inputName = page.getByRole("textbox", { name: "Name" });
		this.emptyLabels = page.getByText("No Labels yet.");
	}

	async fillLabelForm(label) {
		await this.inputName.fill(label);
		await this.saveButton.click();
	}
}
