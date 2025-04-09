import { DashboardPage, LoginPage, TaskPage, BasePage } from "./co/index.js";
import { getNewTaskData, loginCredentials, expectSuccessNotification, Status, Label, Filter, taskOne } from "./helpers/index.js";
import { test, expect } from "@playwright/test";

test.describe("TasksPage page tests", () => {
	test.describe("Statuses tests", () => {
		let taskPage;
		let basePage;
		let createButtonLoc;

		test.beforeEach(async ({ page }) => {
			let loginPage;

			await test.step("Open login page", async () => {
				loginPage = new LoginPage(page);
				await BasePage.openPage(page, loginPage.pageName);
			});

			await test.step("Log in with credentials", async () => {
				await loginPage.login(loginCredentials);
			});

			await test.step("Check that logged in successfully", async () => {
				const dashboardPage = new DashboardPage(page);
				await expect(dashboardPage.dashboardTitleLoc).toBeVisible();
				taskPage = new TaskPage(page);
				basePage = new BasePage(page);
				createButtonLoc = await basePage.getCreateEntityLoc(taskPage.pageName);
			});
		});

		test("Create a new task form contains all required fields", async ({ page }) => {
			await test.step("Open task page", async () => {
				await BasePage.openPage(page, taskPage.pageName);
			});

			await test.step('Click the button "Create new task"', async () => {
				await createButtonLoc.click();
			});

			await test.step("Check that task form elements are displayed", async () => {
				await expect(basePage.rootLoc).toBeVisible();
				await expect(taskPage.createNewTaskAssigneInputLoc).toBeVisible();
				await expect(taskPage.createNewTaskStatusInputLoc).toBeVisible();
				await expect(taskPage.createNewTaskLabelInputLoc).toBeVisible();
				await expect(taskPage.createNewTaskTitleInputLoc).toBeVisible();
				await expect(taskPage.createNewTaskContentInputLoc).toBeVisible();
				await expect(basePage.saveButtonLoc).toBeVisible();
			});
		});

		test("Create task with PUBLISHED statuses", async ({ page }) => {
			const task = await getNewTaskData(Status.PUBLISHED, Label.BUG);

			await test.step("Open task page", async () => {
				await BasePage.openPage(page, taskPage.pageName);
			});

			await test.step('Click the button "Create new task"', async () => {
				await createButtonLoc.click();
			});

			await test.step("Create a new task", async () => {
				await taskPage.fillTaskFormByData(task);
				await expectSuccessNotification(page, "Element created");
			});
		});

		test("Panel of filters contains all required filters", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskPage.pageName);
			});

			await test.step("Check that all filters elements are displayed", async () => {
				await expect(taskPage.createNewTaskAssigneInputLoc).toBeVisible();
				await expect(taskPage.createNewTaskStatusInputLoc).toBeVisible();
				await expect(taskPage.createNewTaskLabelInputLoc).toBeVisible();
			});
		});

		test("Table contains all required collumns", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskPage.pageName);
			});

			await test.step("Check that form selector elements are displayed", async () => {
				await expect(taskPage.tableRootLoc).toBeVisible();

				for (const column of taskPage.collumnsNames) {
					await expect(page.getByRole("heading", { name: column })).toBeVisible();
				}
			});
		});

		test("A task contains all required elements", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskPage.pageName);
			});

			await test.step("Check that task's elements are displayed", async () => {
				const taskName = await taskPage.getFieldLocForTaskNum(1, taskPage.nameStrLoc);
				const taskDescription = await taskPage.getFieldLocForTaskNum(1, taskPage.descriptionStrLoc);
				const taskIndexLocator = await taskPage.getFieldLocForTaskNum(1, taskPage.indexStrLoc);
				const taskEditButton = await taskPage.getFieldLocForTaskNum(1, taskPage.editButtonStrLoc);
				const taskShowButton = await taskPage.getFieldLocForTaskNum(1, taskPage.showButtonStrLoc);

				await expect(taskName).toBeVisible();
				await expect(taskDescription).toBeVisible();
				await expect(taskIndexLocator).toBeVisible();
				await expect(taskEditButton).toBeVisible();
				await expect(taskShowButton).toBeVisible();
			});
		});

		test("A certain task contains correct data", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskPage.pageName);
			});

			await test.step("Check that a task contains correct data", async () => {
				const taskName = await taskPage.getFieldLocForTaskNum(1, taskPage.nameStrLoc);
				const taskDescription = await taskPage.getFieldLocForTaskNum(1, taskPage.descriptionStrLoc);
				const taskIndexLocator = await taskPage.getFieldLocForTaskNum(1, taskPage.indexStrLoc);

				await expect(taskName).toHaveText(taskOne.title);
				await expect(taskDescription).toHaveText(taskOne.description);
				await expect(taskIndexLocator).toHaveText(`Index: ${taskOne.index}`);
			});
		});

		test("Filter tasks for certain assignee and check their count", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskPage.pageName);
			});

			await test.step("Select certain assignee", async () => {
				await taskPage.selectFilter(Filter.ASSIGNEE, "john@google.com");
				await taskPage.addFilterButtonLoc.waitFor();
			});

			await test.step("Check that certain tasks are displayed in appropriate columns", async () => {
				const tasksInDraft = await taskPage.getTasksInColumn(page, Status.DRAFT);
				const tasksInToReview = await taskPage.getTasksInColumn(page, Status.TO_REVIEW);
				const tasksInToFixed = await taskPage.getTasksInColumn(page, Status.TO_BE_FIXED);
				const tasksInToPublish = await taskPage.getTasksInColumn(page, Status.TO_PUBLISH);
				const tasksInPublished = await taskPage.getTasksInColumn(page, Status.PUBLISHED);

				expect(tasksInDraft.length).toBe(2);
				expect(tasksInToReview.length).toBe(1);
				expect(tasksInToFixed.length).toBe(1);
				expect(tasksInToPublish.length).toBe(0);
				expect(tasksInPublished.length).toBe(1);
			});
		});

		test("Filter tasks for certain status", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskPage.pageName);
			});

			await test.step("Select certain status", async () => {
				await taskPage.selectFilter(Filter.STATUS, Status.DRAFT);
				await taskPage.addFilterButtonLoc.waitFor();
			});

			await test.step("Check that certain tasks are displayed in appropriate columns", async () => {
				const tasksInDraft = await taskPage.getTasksInColumn(page, Status.DRAFT);
				const tasksInToReview = await taskPage.getTasksInColumn(page, Status.TO_REVIEW);
				const tasksInToFixed = await taskPage.getTasksInColumn(page, Status.TO_BE_FIXED);
				const tasksInToPublish = await taskPage.getTasksInColumn(page, Status.TO_PUBLISH);
				const tasksInPublished = await taskPage.getTasksInColumn(page, Status.PUBLISHED);

				expect(tasksInDraft.length).toBe(3);
				expect(tasksInToReview.length).toBe(0);
				expect(tasksInToFixed.length).toBe(0);
				expect(tasksInToPublish.length).toBe(0);
				expect(tasksInPublished.length).toBe(0);
			});
		});

		test("Filter tasks for certain label", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskPage.pageName);
			});

			await test.step("Select certain label", async () => {
				await taskPage.selectFilter(Filter.LABEL, Label.CRITICAL);
				await taskPage.addFilterButtonLoc.waitFor();
			});

			await test.step("Check that certain tasks are displayed in appropriate columns", async () => {
				const tasksInDraft = await taskPage.getTasksInColumn(page, Status.DRAFT);
				const tasksInToReview = await taskPage.getTasksInColumn(page, Status.TO_REVIEW);
				const tasksInToFixed = await taskPage.getTasksInColumn(page, Status.TO_BE_FIXED);
				const tasksInToPublish = await taskPage.getTasksInColumn(page, Status.TO_PUBLISH);
				const tasksInPublished = await taskPage.getTasksInColumn(page, Status.PUBLISHED);

				expect(tasksInDraft.length).toBe(0);
				expect(tasksInToReview.length).toBe(0);
				expect(tasksInToFixed.length).toBe(0);
				expect(tasksInToPublish.length).toBe(0);
				expect(tasksInPublished.length).toBe(1);
			});
		});

		test("Filter tasks with certain name for certain assignee and check their names", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskPage.pageName);
			});

			await test.step("Select certain assignee", async () => {
				await taskPage.selectFilter(Filter.ASSIGNEE, "john@google.com");
				await taskPage.addFilterButtonLoc.waitFor();
			});

			await test.step("Check that tasks with certain names are displayed in appropriate columns", async () => {
				expect(await taskPage.isTaskWithNameInColumn(page, Status.DRAFT, "Task 11")).toBeTruthy();
				expect(await taskPage.isTaskWithNameInColumn(page, Status.DRAFT, "Task 5")).toBeTruthy();
				expect(await taskPage.isTaskWithNameInColumn(page, Status.TO_REVIEW, "Task 2")).toBeTruthy();
				expect(await taskPage.isTaskWithNameInColumn(page, Status.TO_BE_FIXED, "Task 1")).toBeTruthy();
				expect(await taskPage.isTaskWithNameInColumn(page, Status.PUBLISHED, "Task 15")).toBeTruthy();
			});
		});

		test("Drag task with certain name and drop it to appropriate column", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskPage.pageName);
			});

			await test.step("Drag 'Task 11' and drop it to 'To Review' column", async () => {
				const from = await taskPage.getTaskByNumber(11);
				const to = await taskPage.getTaskByNumber(2);

				await taskPage.dragTask(page, from, to);
			});

			await test.step("Check that certain tasks are displayed in appropriate columns", async () => {
				expect(await taskPage.isTaskWithNameInColumn(page, Status.TO_REVIEW, "Task 11")).toBeTruthy();
			});
		});
	});
});
