import { BasePage } from "./BasePage";

export class TaskStatusesPage extends BasePage {
	constructor(page) {
		super(page);
		this.page = page;
		this.pageName = "taskStatusesPage";
		this.cellNames = ["id", "Name", "Slug", "Created at"];

		this.slugRegEx = /\b[a-zA-Z]+(?:_[a-zA-Z]+)*\b|\b[a-z]+(?:[A-Z][a-z]*)+\b/;

		this.emptyStatuses = page.getByText("No Task statuses yet.");
		this.inputName = page.getByRole("textbox", { name: "Name" });
		this.inputSlug = page.getByRole("textbox", { name: "Slug" });
	}

	async fillTaskStatusForm(status) {
		await this.inputName.fill(status.name);
		await this.inputSlug.fill(status.slug);
		await this.saveButton.click();
	}
}
