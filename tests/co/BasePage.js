import { expect } from "@playwright/test";

export class BasePage {
	constructor(page) {
		this.page = page;
		this.loginPage = "#/login/";
		this.userSlug = "#/users/";
		this.taskStatusSlug = "#/task_statuses/";
		this.labelSlug = "#/labels/";
		this.taskSlug = "#/tasks/";

		this.idRegEx = /^\d+/;
		this.nameRegEx = /\b[a-zA-Z][a-zA-Z]*\b/;
		this.dateRegEx = /^(\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)|\d{1,2}\.\d{1,2}\.\d{4}, \d{2}:\d{2}:\d{2})$/;

		this.rootLoc = page.locator("div.MuiPaper-root.MuiCard-root.RaCreate-card");
		this.showButtonLoc = page.getByRole("link", { name: "Show" });
		this.saveButtonLoc = page.getByRole("button", { name: "Save" });
		this.deleteButtonLoc = page.getByRole("button", { name: "Delete" });
		this.headerRowLoc = page.locator("tr.RaDatagrid-headerRow");
		this.rowLoc = page.locator("tr.RaDatagrid-clickableRow");
		this.selectAllCheckboxLoc = page.getByRole("checkbox", { name: "Select all" });
	}

	async openPage(pageName, id) {
		let url = "";
		switch (pageName) {
			case "loginPage":
				url = `/${this.loginPage}`;
				break;
			case "userPage":
				url = `/${this.userSlug}`;
				break;
			case "taskStatusesPage":
				url = `/${this.taskStatusSlug}`;
				break;
			case "labelPage":
				url = `/${this.labelSlug}`;
				break;
			case "taskPage":
				url = `/${this.taskSlug}`;
				break;
			default:
				url = "/#/";
				break;
		}

		let resUrl = id ? `${url}${id}` : url;

		await this.page.goto(resUrl);
	}

	getCreateEntityLoc(pageName) {
		let slug = "";
		switch (pageName) {
			case "userPage":
				slug = this.userSlug;
				break;
			case "taskStatusesPage":
				slug = this.taskStatusSlug;
				break;
			case "labelPage":
				slug = this.labelSlug;
				break;
			case "taskPage":
				slug = this.taskSlug;
				break;
			default:
				slug = "/#/";
				break;
		}

		return this.page.locator(`a[href*="${slug}create"]`);
	}

	async getHeaderCellByTextLocator(text) {
		return this.page.getByRole("button", { name: text });
	}

	getRowLocator() {
		return this.page.locator("tr.RaDatagrid-clickableRow");
	}

	async getRowCellLoc(rowNum, cellNum) {
		const rowLoc = this.getRowLocator();
		return rowLoc.nth(rowNum).locator("td").nth(cellNum);
	}

	async getRowByTextLoc(text) {
		return this.page.getByRole("row").filter({ hasText: text });
	}

	expectVisibility = async (entityData, isVisible = true) => {
		const row = await this.page.getByRole("row").filter({ hasText: entityData });
		return isVisible ? expect(row).toBeVisible() : expect(row).not.toBeVisible();
	};

	expectNotification = async (text) => {
		return expect(await this.page.getByText(text)).toBeVisible();
	};
}
