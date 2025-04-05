import { DashboardPage, LoginPage, TaskStatusesPage, BasePage } from "./co/index.js";
import { loginCredentials, expectSuccessNotification, checkIsEntityInTable } from "./helpers/index.js";
import { test, expect } from "@playwright/test";

test.describe("TasksStatusesPage tests", () => {
	test.describe("Task statuses tests", () => {
		let taskStatusesPage;
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
				taskStatusesPage = new TaskStatusesPage(page);
				basePage = new BasePage(page);
				createButtonLoc = await basePage.getCreateEntityLoc(taskStatusesPage.pageName);
			});
		});

		test("Create a new task status form contains all required fields", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskStatusesPage.pageName);
			});

			await test.step('Click the button "Create new task status"', async () => {
				await createButtonLoc.click();
			});

			await test.step("Check that new task status form elements are displayed", async () => {
				await expect(basePage.rootLoc).toBeVisible();
				await expect(taskStatusesPage.statusNameInputLoc).toBeVisible();
				await expect(taskStatusesPage.statusSlugInputLoc).toBeVisible();
				await expect(basePage.saveButtonLoc).toBeVisible();
			});
		});

		test("Create new task status", async ({ page }) => {
			const status = { name: "To Design", slug: "to_design" };

			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskStatusesPage.pageName);
			});

			await test.step('Click the button "Create new task status"', async () => {
				await createButtonLoc.click();
			});

			await test.step("Create a new task status", async () => {
				await taskStatusesPage.fillTaskStatusFormByData(status);
				await expectSuccessNotification(page, "Element created");
			});
		});

		test("Header of table contains all required cells", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskStatusesPage.pageName);
			});

			await test.step("Check that form header elements are displayed", async () => {
				await expect(basePage.headerRowLoc).toBeVisible();
				await expect(basePage.selectAllCheckboxLoc).toBeVisible();

				for (let i = 0; i < taskStatusesPage.cellNames.length; i++) {
					await expect(await BasePage.getHeaderCellByTextLocator(page, taskStatusesPage.cellNames[i])).toBeVisible();
				}
			});
		});

		test("A status row contains correct data", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskStatusesPage.pageName);
			});

			await test.step("Check that task statuses page contains correct data", async () => {
                const rowCellLocOne = await BasePage.getRowCellLoc(page, 0, 1);
                const rowCellLocTwo = await BasePage.getRowCellLoc(page, 0, 2);
                const rowCellLocThree = await BasePage.getRowCellLoc(page, 0, 3);
                const rowCellLocFour = await BasePage.getRowCellLoc(page, 0, 4);

				await expect(rowCellLocOne).toContainText(BasePage.idRegEx);
				await expect(rowCellLocTwo).toContainText(BasePage.nameRegEx);
				await expect(rowCellLocThree).toContainText(taskStatusesPage.slugRegEx);
				await expect(rowCellLocFour).toContainText(BasePage.dateRegEx);
			});
		});

		test("Task statuses form has correct elements", async ({ page }) => {
            const statusId = 1;

			await test.step("Open certain user page", async () => {
				await BasePage.openPage(page, taskStatusesPage.pageName, statusId);
			});

			await test.step("Check that task status form elements are displayed", async () => {
				await expect(basePage.showButtonLoc).toBeEnabled();
				await expect(basePage.saveButtonLoc).toBeDisabled();
				await expect(taskStatusesPage.deleteButtonLoc).toBeEnabled();
				await expect(taskStatusesPage.statusNameInputLoc).toBeVisible();
				await expect(taskStatusesPage.statusSlugInputLoc).toBeVisible();
			});
		});

		test("Edit a status with correct data", async ({ page }) => {
			await test.step("Create new task status", async () => {
				const status = { name: "To Design", slug: "to_design" };

				await test.step("Open task statuses page", async () => {
					await BasePage.openPage(page, taskStatusesPage.pageName);
				});

				await test.step('Click the button "Create new task status"', async () => {
					await createButtonLoc.click();
				});

				await test.step("Create a new task status", async () => {
					await taskStatusesPage.fillTaskStatusFormByData(status);
					await expectSuccessNotification(page, "Element created");
				});
			});

			await test.step("Edit the new task status with valid data", async () => {
				const status2 = { name: "To Analist", slug: "to_analist" };
				const statusId = 6;

				await test.step("Open certain task status page", async () => {
					await BasePage.openPage(page, taskStatusesPage.pageName, statusId);
				});

				await test.step("Edit certain task status by valid data", async () => {
					await taskStatusesPage.fillTaskStatusFormByData(status2);
					await expectSuccessNotification(page, "Element updated");
                    await checkIsEntityInTable(page, status2.name);
				});
			});
		});

		test("Delete a task status", async ({ page }) => {
			const status = { name: "To Design", slug: "to_design" };

			await test.step("Create new task status", async () => {
				await test.step("Open task statuses page", async () => {
					await BasePage.openPage(page, taskStatusesPage.pageName);
				});

				await test.step('Click the button "Create new task status"', async () => {
					await createButtonLoc.click();
				});

				await test.step("Create a new task status", async () => {
					await taskStatusesPage.fillTaskStatusFormByData(status);
					await expectSuccessNotification(page, "Element created");
				});
			});

			await test.step("Delete the new task status", async () => {
				const statusId = 6;

				await test.step("Open certain task status page", async () => {
					await BasePage.openPage(page, taskStatusesPage.pageName, statusId);
				});

				await test.step("Delete the new status", async () => {
					await taskStatusesPage.deleteButtonLoc.click();
					await expectSuccessNotification(page, "Element deleted");
				});

				await test.step("Check that status is not displayed in the table", async () => {
					await BasePage.openPage(page, taskStatusesPage.pageName);
					await checkIsEntityInTable(page, status.name);
				});
			});
		});

		test("Bulk delete statuses", async ({ page }) => {
			await test.step("Open task statuses page", async () => {
				await BasePage.openPage(page, taskStatusesPage.pageName);
			});

			await test.step('Click the button "Select All"', async () => {
				await basePage.selectAllCheckboxLoc.click();
				await expectSuccessNotification(page, "items selected");
			});

			await test.step("Click the button Delete", async () => {
				await taskStatusesPage.deleteButtonLoc.click();
			});

			await test.step("Check empty statuses list", async () => {
				await expect(taskStatusesPage.emptyStatusesLoc).toBeVisible();
			});
		});
	});
});
