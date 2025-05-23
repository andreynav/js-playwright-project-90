import { test, expect } from "./co/co.js";

test.describe("TasksStatusesPage tests", () => {
	test.describe("Task statuses tests", () => {
		test("Create a new task status form contains all required fields", async ({ basePage, taskStatusesPage }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskStatusesPage.pageName);
			});

			await test.step('Click the button "Create new task status"', async () => {
				await basePage.getCreateEntityLoc(taskStatusesPage.pageName).click();
			});

			await test.step("Check that new task status form elements are displayed", async () => {
				await expect(basePage.root).toBeVisible();
				await expect(taskStatusesPage.inputName).toBeVisible();
				await expect(taskStatusesPage.inputSlug).toBeVisible();
				await expect(basePage.saveButton).toBeVisible();
			});
		});

		test("Create new task status", async ({ basePage, taskStatusesPage }) => {
			const status = { name: "To Design", slug: "to_design" };

			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskStatusesPage.pageName);
			});

			await test.step('Click the button "Create new task status"', async () => {
				await basePage.getCreateEntityLoc(taskStatusesPage.pageName).click();
			});

			await test.step("Create a new task status", async () => {
				await taskStatusesPage.fillTaskStatusForm(status);
				await basePage.expectNotification("Element created");
			});
		});

		test("Header of table contains all required cells", async ({ basePage, taskStatusesPage }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskStatusesPage.pageName);
			});

			await test.step("Check that form header elements are displayed", async () => {
				await expect(basePage.headerRow).toBeVisible();
				await expect(basePage.checkboxSelectAll).toBeVisible();

				for (let i = 0; i < taskStatusesPage.cellNames.length; i++) {
					await expect(await basePage.getHeaderCellByTextLocator(taskStatusesPage.cellNames[i])).toBeVisible();
				}
			});
		});

		test("A status row contains correct data", async ({ basePage, taskStatusesPage }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskStatusesPage.pageName);
			});

			await test.step("Check that task statuses page contains correct data", async () => {
				const rowCellLocOne = await basePage.getRowCellLocator(0, 1);
				const rowCellLocTwo = await basePage.getRowCellLocator(0, 2);
				const rowCellLocThree = await basePage.getRowCellLocator(0, 3);
				const rowCellLocFour = await basePage.getRowCellLocator(0, 4);

				await expect(rowCellLocOne).toContainText(basePage.idRegEx);
				await expect(rowCellLocTwo).toContainText(basePage.nameRegEx);
				await expect(rowCellLocThree).toContainText(taskStatusesPage.slugRegEx);
				await expect(rowCellLocFour).toContainText(basePage.dateRegEx);
			});
		});

		test("Task statuses form has correct elements", async ({ basePage, taskStatusesPage }) => {
			const statusId = 1;

			await test.step("Open certain user page", async () => {
				await basePage.openPage(taskStatusesPage.pageName, statusId);
			});

			await test.step("Check that task status form elements are displayed", async () => {
				await expect(basePage.showButton).toBeEnabled();
				await expect(basePage.saveButton).toBeDisabled();
				await expect(taskStatusesPage.deleteButton).toBeEnabled();
				await expect(taskStatusesPage.inputName).toBeVisible();
				await expect(taskStatusesPage.inputSlug).toBeVisible();
			});
		});

		test("Edit a status with correct data", async ({ basePage, taskStatusesPage }) => {
			await test.step("Create new task status", async () => {
				const status = { name: "To Design", slug: "to_design" };

				await test.step("Open task statuses page", async () => {
					await basePage.openPage(taskStatusesPage.pageName);
				});

				await test.step('Click the button "Create new task status"', async () => {
					await basePage.getCreateEntityLoc(taskStatusesPage.pageName).click();
				});

				await test.step("Create a new task status", async () => {
					await taskStatusesPage.fillTaskStatusForm(status);
					await basePage.expectNotification("Element created");
				});
			});

			await test.step("Edit the new task status with valid data", async () => {
				const status2 = { name: "To Analist", slug: "to_analist" };
				const statusId = 6;

				await test.step("Open certain task status page", async () => {
					await basePage.openPage(taskStatusesPage.pageName, statusId);
				});

				await test.step("Edit certain task status by valid data", async () => {
					await taskStatusesPage.fillTaskStatusForm(status2);
					await basePage.expectNotification("Element updated");
					await basePage.expectVisibility(status2.name);
				});
			});
		});

		test("Delete a task status", async ({ basePage, taskStatusesPage }) => {
			const status = { name: "To Design", slug: "to_design" };

			await test.step("Create new task status", async () => {
				await test.step("Open task statuses page", async () => {
					await basePage.openPage(taskStatusesPage.pageName);
				});

				await test.step('Click the button "Create new task status"', async () => {
					await basePage.getCreateEntityLoc(taskStatusesPage.pageName).click();
				});

				await test.step("Create a new task status", async () => {
					await taskStatusesPage.fillTaskStatusForm(status);
					await basePage.expectNotification("Element created");
				});
			});

			await test.step("Delete the new task status", async () => {
				const statusId = 6;

				await test.step("Open certain task status page", async () => {
					await basePage.openPage(taskStatusesPage.pageName, statusId);
				});

				await test.step("Delete the new status", async () => {
					await taskStatusesPage.deleteButton.click();
					await basePage.expectNotification("Element deleted");
				});

				await test.step("Check that status is not displayed in the table", async () => {
					await basePage.openPage(taskStatusesPage.pageName);
					await basePage.expectVisibility(status.name, false);
				});
			});
		});

		test("Bulk delete statuses", async ({ basePage, taskStatusesPage }) => {
			await test.step("Open task statuses page", async () => {
				await basePage.openPage(taskStatusesPage.pageName);
			});

			await test.step('Click the button "Select All"', async () => {
				await basePage.checkboxSelectAll.click();
				await basePage.expectNotification("items selected");
			});

			await test.step("Click the button Delete", async () => {
				await taskStatusesPage.deleteButton.click();
			});

			await test.step("Check empty statuses list", async () => {
				await expect(taskStatusesPage.emptyStatuses).toBeVisible();
			});
		});
	});
});
