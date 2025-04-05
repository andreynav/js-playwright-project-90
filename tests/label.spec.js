import { DashboardPage, LoginPage, LabelPage, BasePage } from "./co/index.js";
import { loginCredentials, expectSuccessNotification, checkIsEntityInTable } from "./helpers/index.js";
import { test, expect } from "@playwright/test";

test.describe("LabelPage tests", () => {
	let labelPage;
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
			labelPage = new LabelPage(page);
			basePage = new BasePage(page);
			createButtonLoc = await basePage.getCreateEntityLoc(labelPage.pageName);
		});
	});

	test("Create a label form contains all required fields", async ({ page }) => {
		await test.step("Open labels page", async () => {
			await BasePage.openPage(page, labelPage.pageName);
		});

		await test.step('Click the button "Create new Label"', async () => {
			await createButtonLoc.click();
		});

		await test.step("Check that new Label form elements are displayed", async () => {
			await expect(basePage.rootLoc).toBeVisible();
			await expect(labelPage.labelNameInputLoc).toBeVisible();
			await expect(basePage.saveButtonLoc).toBeVisible();
		});
	});

	test("Create new label", async ({ page }) => {
		const label = "design";

		await test.step("Open labels page", async () => {
			await BasePage.openPage(page, labelPage.pageName);
		});

		await test.step('Click the button "Create new Label"', async () => {
			await createButtonLoc.click();
		});

		await test.step("Create a new label", async () => {
			await labelPage.fillLabelFormByData(label);
			await expectSuccessNotification(page, "Element created");
		});
	});

	test("Header of table contains all required cells", async ({ page }) => {
		await test.step("Open labels page", async () => {
			await BasePage.openPage(page, labelPage.pageName);
		});

		await test.step("Check that form header elements are displayed", async () => {
			await expect(basePage.headerRowLoc).toBeVisible();
			await expect(basePage.selectAllCheckboxLoc).toBeVisible();

			for (let i = 0; i < labelPage.cellNames.length; i++) {
				await expect(await BasePage.getHeaderCellByTextLocator(page, labelPage.cellNames[i])).toBeVisible();
			}
		});
	});

	test("A label row contains correct data", async ({ page }) => {
		await test.step("Open labels page", async () => {
			await BasePage.openPage(page, "labelPage");
		});

		await test.step("Check that label page contains correct data", async () => {
			const rowCellLocOne = await BasePage.getRowCellLoc(page, 0, 1);
			const rowCellLocTwo = await BasePage.getRowCellLoc(page, 0, 2);
			const rowCellLocThree = await BasePage.getRowCellLoc(page, 0, 3);

			await expect(rowCellLocOne).toContainText(BasePage.idRegEx);
			await expect(rowCellLocTwo).toContainText(BasePage.nameRegEx);
			await expect(rowCellLocThree).toContainText(BasePage.dateRegEx);
		});
	});

	test("Task label form has correct elements", async ({ page }) => {
		const labelId = 1;

		await test.step("Open certain label page", async () => {
			await BasePage.openPage(page, labelPage.pageName, labelId);
		});

		await test.step("Check that label form elements are displayed", async () => {
			await expect(basePage.showButtonLoc).toBeEnabled();
			await expect(basePage.saveButtonLoc).toBeDisabled();
			await expect(labelPage.deleteButtonLoc).toBeEnabled();
			await expect(labelPage.labelNameInputLoc).toBeVisible();
		});
	});

	test("Edit a label with correct data", async ({ page }) => {
		await test.step("Create new label ", async () => {
			const label = "design";

			await test.step("Open labels page", async () => {
				await BasePage.openPage(page, labelPage.pageName);
			});

			await test.step('Click the button "Create new Label"', async () => {
				await createButtonLoc.click();
			});

			await test.step("Create a new label", async () => {
				await labelPage.fillLabelFormByData(label);
				await expectSuccessNotification(page, "Element created");
			});
		});

		await test.step("Edit the new label with valid data", async () => {
			const label2 = "analisys";
			const labelId = 6;

			await test.step("Open certain label page", async () => {
				await BasePage.openPage(page, "labelPage", labelId);
			});

			await test.step("Edit certain label by valid data", async () => {
				await labelPage.fillLabelFormByData(label2);
				await expectSuccessNotification(page, "Element updated");
				await expect(await BasePage.getRowByTextLoc(page, label2)).toBeVisible();
			});
		});
	});

	test("Delete a label", async ({ page }) => {
		const label = "design";

		await test.step("Create new label ", async () => {
			await test.step("Open labels page", async () => {
				await BasePage.openPage(page, labelPage.pageName);
			});

			await test.step('Click the button "Create new Label"', async () => {
				await createButtonLoc.click();
			});

			await test.step("Create a new label", async () => {
				await labelPage.fillLabelFormByData(label);
				await expectSuccessNotification(page, "Element created");
			});
		});

		await test.step("Delete the new label", async () => {
			const labelId = 6;

			await test.step("Open certain label page", async () => {
				await BasePage.openPage(page, labelPage.pageName, labelId);
			});

			await test.step("Delete the new label", async () => {
				await labelPage.deleteButtonLoc.click();
				await expectSuccessNotification(page, "Element deleted");
			});

			await test.step("Check that label is not displayed in the table", async () => {
				await BasePage.openPage(page, labelPage.pageName);
				await checkIsEntityInTable(page, label);
			});
		});
	});

	test("Bulk delete labels", async ({ page }) => {
		await test.step("Open labels page", async () => {
			await BasePage.openPage(page, labelPage.pageName);
		});

		await test.step('Click the button "Select All"', async () => {
			await basePage.selectAllCheckboxLoc.click();
			await expectSuccessNotification(page, "tems selected");
		});

		await test.step("Click the button Delete", async () => {
			await labelPage.deleteButtonLoc.click();
		});

		await test.step("Check empty labels list", async () => {
			await expect(labelPage.emptyLabelsLoc).toBeVisible();
		});
	});
});
