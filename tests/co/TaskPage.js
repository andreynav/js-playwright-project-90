import { BasePage } from "./BasePage";

export class TaskPage extends BasePage {
	FieldsEnum = {
		ASSIGNEE: () => this.createNewTaskAssigneInputLoc,
		STATUS: () => this.createNewTaskStatusInputLoc,
		LABEL: () => this.createNewTaskLabelInputLoc,
	};

	constructor(page) {
		super(page);
		this.page = page;
		this.pageName = "taskPage";
		this.collumnsNames = ["Draft", "To Review", "To Be Fixed", "To Publish", "Published"];

		this.createNewTaskAssigneInputLoc = page.getByRole("combobox", { name: "Assignee" });
		this.createNewTaskStatusInputLoc = page.getByRole("combobox", { name: "Status" });
		this.createNewTaskLabelInputLoc = page.getByRole("combobox", { name: "Label" });
		this.createNewTaskTitleInputLoc = page.getByRole("textbox", { name: "Title" });
		this.createNewTaskContentInputLoc = page.getByRole("textbox", { name: "Content" });
		this.addFilterButtonLoc = page.getByRole("button", { name: "Add filter" });

		this.tableRootLoc = page.locator(".RaList-content > .MuiBox-root");
		this.nameStrLoc = "div.MuiTypography-h5";
		this.descriptionStrLoc = "p.MuiTypography-body2";
		this.indexStrLoc = "p.MuiTypography-body1";
		this.editButtonStrLoc = '[aria-label="Edit"]';
		this.showButtonStrLoc = '[aria-label="Show"]';
	}

	async selectItem(field, value) {
		await this.FieldsEnum[field]().click();
		await this.page.getByRole("option", { name: value }).click();
		if (field === "LABEL") {
			await this.page.getByTestId("selectArray").click({ force: true });
		}
	}

	async selectFilter(filterName, option) {
		await this.page.getByRole("combobox", { name: filterName }).click();
		await this.page.getByRole("option", { name: option }).click();
	}

	async fillTaskFormByData(task) {
		await this.selectItem("ASSIGNEE", task.assignee);
		await this.createNewTaskTitleInputLoc.fill(task.title);
		await this.createNewTaskContentInputLoc.fill(task.content);
		await this.selectItem("STATUS", task.status);
		await this.selectItem("LABEL", task.label);
		await this.saveButtonLoc.click();
	}

	getTaskByNumber(number) {
		return this.page.locator(`[data-rfd-draggable-id="${number}"]`);
	}

	async getFieldLocForTaskNum(number, locName) {
		return await this.getTaskByNumber(number).locator(locName);
	}

	async getTasksInColumn(columnName) {
		const columnLocator = this.page.locator(`xpath=//h6[text()='${columnName}']/following-sibling::div[@data-rfd-droppable-id]//div[@data-rfd-draggable-id]`);
		const taskCount = await columnLocator.count();
		const tasks = [];
		for (let i = 0; i < taskCount; i++) {
			tasks.push(await columnLocator.nth(i).textContent());
		}
		return tasks;
	}

	async isTaskWithNameInColumn(columnName, taskName) {
		const taskInColumn = this.page.locator(`xpath=//h6[text()='${columnName}']/following-sibling::div[@data-rfd-droppable-id]//div[@data-rfd-draggable-id]`);
		const taskCount = await taskInColumn.filter({ hasText: taskName }).count();
		return taskCount === 1;
	}

	async dragTask(from, to, upTimeout = 500) {
		const fromBox = await from.boundingBox();
		const toBox = await to.boundingBox();

		const fromCenter = {
			x: fromBox.x + fromBox.width / 2,
			y: fromBox.y + fromBox.height / 2,
		};

		const toCenter = {
			x: toBox.x + toBox.width / 2,
			y: toBox.y + toBox.height / 2,
		};

		await this.page.mouse.move(fromCenter.x, fromCenter.y);
		await this.page.mouse.down();
		await this.page.mouse.move(toCenter.x, toCenter.y, { steps: 20 });
		await this.page.mouse.up();
		await this.page.waitForTimeout(upTimeout);
	}
}
