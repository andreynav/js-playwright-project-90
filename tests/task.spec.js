import { test, expect } from "./co/co.js";
import data from "./data/testData.js";

const { Status, Label, Filter, taskOne } = data;

test.describe("TasksPage page tests", () => {
	test.describe("Statuses tests", () => {
		test("Create a new task form contains all required fields", async ({ basePage, taskPage }) => {
			await test.step("Open task page", async () => {
				await basePage.openPage(taskPage.pageName);
			});

			await test.step('Click the button "Create new task"', async () => {
				await basePage.getCreateEntityLoc(taskPage.pageName).click();
			});

			await test.step("Check that task form elements are displayed", async () => {
				await expect(basePage.root).toBeVisible();
				await expect(taskPage.inputAssigne).toBeVisible();
				await expect(taskPage.inputStatus).toBeVisible();
				await expect(taskPage.inputLabel).toBeVisible();
				await expect(taskPage.inputTitle).toBeVisible();
				await expect(taskPage.inputContent).toBeVisible();
				await expect(basePage.saveButton).toBeVisible();
			});
		});

		test("Create task with PUBLISHED statuses", async ({ basePage, taskPage }) => {
			const task = await taskPage.getNewTaskData(Status.PUBLISHED, Label.BUG);

			await test.step("Open task page", async () => {
				await basePage.openPage(taskPage.pageName);
			});

			await test.step('Click the button "Create new task"', async () => {
				await basePage.getCreateEntityLoc(taskPage.pageName).click();
			});

			await test.step("Create a new task", async () => {
				await taskPage.fillTaskForm(task);
				await basePage.expectNotification("Element created");
			});
		});

		test("Panel of filters contains all required filters", async ({ basePage, taskPage }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskPage.pageName);
			});

			await test.step("Check that all filters elements are displayed", async () => {
				await expect(taskPage.inputAssigne).toBeVisible();
				await expect(taskPage.inputStatus).toBeVisible();
				await expect(taskPage.inputLabel).toBeVisible();
			});
		});

		test("Table contains all required collumns", async ({ basePage, taskPage, page }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskPage.pageName);
			});

			await test.step("Check that form selector elements are displayed", async () => {
				await expect(taskPage.root).toBeVisible();

				for (const column of taskPage.collumnsNames) {
					await expect(page.getByRole("heading", { name: column })).toBeVisible();
				}
			});
		});

		test("A task contains all required elements", async ({ basePage, taskPage }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskPage.pageName);
			});

			await test.step("Check that task elements are displayed", async () => {
				const taskName = await taskPage.getFieldLocatorOfTaskNumber(1, taskPage.name);
				const taskDescription = await taskPage.getFieldLocatorOfTaskNumber(1, taskPage.description);
				const taskIndexLocator = await taskPage.getFieldLocatorOfTaskNumber(1, taskPage.index);
				const taskEditButton = await taskPage.getFieldLocatorOfTaskNumber(1, taskPage.editButton);
				const taskShowButton = await taskPage.getFieldLocatorOfTaskNumber(1, taskPage.showButton);

				await expect(taskName).toBeVisible();
				await expect(taskDescription).toBeVisible();
				await expect(taskIndexLocator).toBeVisible();
				await expect(taskEditButton).toBeVisible();
				await expect(taskShowButton).toBeVisible();
			});
		});

		test("A certain task contains correct data", async ({ basePage, taskPage }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskPage.pageName);
			});

			await test.step("Check that a task contains correct data", async () => {
				const taskName = await taskPage.getFieldLocatorOfTaskNumber(1, taskPage.name);
				const taskDescription = await taskPage.getFieldLocatorOfTaskNumber(1, taskPage.description);
				const taskIndexLocator = await taskPage.getFieldLocatorOfTaskNumber(1, taskPage.index);

				await expect(taskName).toHaveText(taskOne.title);
				await expect(taskDescription).toHaveText(taskOne.description);
				await expect(taskIndexLocator).toHaveText(`Index: ${taskOne.index}`);
			});
		});

		test("Filter tasks for certain assignee and check their count", async ({ basePage, taskPage }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskPage.pageName);
			});

			await test.step("Select certain assignee", async () => {
				await taskPage.selectFilter(Filter.ASSIGNEE, "john@google.com");
				await taskPage.buttonAddFilter.waitFor();
			});

			await test.step("Check that certain tasks are displayed in appropriate columns", async () => {
				const tasksInDraft = await taskPage.getTasksInColumn(Status.DRAFT);
				const tasksInToReview = await taskPage.getTasksInColumn(Status.TO_REVIEW);
				const tasksInToFixed = await taskPage.getTasksInColumn(Status.TO_BE_FIXED);
				const tasksInToPublish = await taskPage.getTasksInColumn(Status.TO_PUBLISH);
				const tasksInPublished = await taskPage.getTasksInColumn(Status.PUBLISHED);

				expect(tasksInDraft.length).toBe(2);
				expect(tasksInToReview.length).toBe(1);
				expect(tasksInToFixed.length).toBe(1);
				expect(tasksInToPublish.length).toBe(0);
				expect(tasksInPublished.length).toBe(1);
			});
		});

		test("Filter tasks for certain status", async ({ basePage, taskPage }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskPage.pageName);
			});

			await test.step("Select certain status", async () => {
				await taskPage.selectFilter(Filter.STATUS, Status.DRAFT);
				await taskPage.buttonAddFilter.waitFor();
			});

			await test.step("Check that certain tasks are displayed in appropriate columns", async () => {
				const tasksInDraft = await taskPage.getTasksInColumn(Status.DRAFT);
				const tasksInToReview = await taskPage.getTasksInColumn(Status.TO_REVIEW);
				const tasksInToFixed = await taskPage.getTasksInColumn(Status.TO_BE_FIXED);
				const tasksInToPublish = await taskPage.getTasksInColumn(Status.TO_PUBLISH);
				const tasksInPublished = await taskPage.getTasksInColumn(Status.PUBLISHED);

				expect(tasksInDraft.length).toBe(3);
				expect(tasksInToReview.length).toBe(0);
				expect(tasksInToFixed.length).toBe(0);
				expect(tasksInToPublish.length).toBe(0);
				expect(tasksInPublished.length).toBe(0);
			});
		});

		test("Filter tasks for certain label", async ({ basePage, taskPage }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskPage.pageName);
			});

			await test.step("Select certain label", async () => {
				await taskPage.selectFilter(Filter.LABEL, Label.CRITICAL);
				await taskPage.buttonAddFilter.waitFor();
			});

			await test.step("Check that certain tasks are displayed in appropriate columns", async () => {
				const tasksInDraft = await taskPage.getTasksInColumn(Status.DRAFT);
				const tasksInToReview = await taskPage.getTasksInColumn(Status.TO_REVIEW);
				const tasksInToFixed = await taskPage.getTasksInColumn(Status.TO_BE_FIXED);
				const tasksInToPublish = await taskPage.getTasksInColumn(Status.TO_PUBLISH);
				const tasksInPublished = await taskPage.getTasksInColumn(Status.PUBLISHED);

				expect(tasksInDraft.length).toBe(0);
				expect(tasksInToReview.length).toBe(0);
				expect(tasksInToFixed.length).toBe(0);
				expect(tasksInToPublish.length).toBe(0);
				expect(tasksInPublished.length).toBe(1);
			});
		});

		test("Filter tasks with certain name for certain assignee and check their names", async ({ basePage, taskPage }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskPage.pageName);
			});

			await test.step("Select certain assignee", async () => {
				await taskPage.selectFilter(Filter.ASSIGNEE, "john@google.com");
				await taskPage.buttonAddFilter.waitFor();
			});

			await test.step("Check that tasks with certain names are displayed in appropriate columns", async () => {
				expect(await taskPage.expectTaskInColumn(Status.DRAFT, "Task 11")).toBeTruthy();
				expect(await taskPage.expectTaskInColumn(Status.DRAFT, "Task 5")).toBeTruthy();
				expect(await taskPage.expectTaskInColumn(Status.TO_REVIEW, "Task 2")).toBeTruthy();
				expect(await taskPage.expectTaskInColumn(Status.TO_BE_FIXED, "Task 1")).toBeTruthy();
				expect(await taskPage.expectTaskInColumn(Status.PUBLISHED, "Task 15")).toBeTruthy();
			});
		});

		test("Drag task with certain name and drop it to appropriate column", async ({ basePage, taskPage }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskPage.pageName);
			});

			await test.step("Drag 'Task 11' and drop it to 'To Review' column", async () => {
				const from = await taskPage.getTaskByNumber(11);
				const to = await taskPage.getTaskByNumber(2);

				await taskPage.dragTask(from, to);
			});

			await test.step("Check that certain tasks are displayed in appropriate columns", async () => {
				expect(await taskPage.expectTaskInColumn(Status.TO_REVIEW, "Task 11")).toBeTruthy();
			});
		});
	});
});
