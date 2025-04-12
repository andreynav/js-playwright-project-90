import { test, expect } from "./co/co.js";
import { expectSuccessNotification, checkIsEntityInTable } from "./helpers/index.js";

test.describe("LabelPage tests", () => {
	test("Create a label form contains all required fields", async ({ basePage, labelPage }) => {
		await test.step("Open labels page", async () => {
			await basePage.openPage(labelPage.pageName);
		});

		await test.step('Click the button "Create new Label"', async () => {
			await basePage.getCreateEntityLoc(labelPage.pageName).click();
		});

		await test.step("Check that new Label form elements are displayed", async () => {
			await expect(basePage.rootLoc).toBeVisible();
			await expect(labelPage.labelNameInputLoc).toBeVisible();
			await expect(basePage.saveButtonLoc).toBeVisible();
		});
	});

	test("Create new label", async ({ basePage, labelPage, page }) => {
		const label = "design";

		await test.step("Open labels page", async () => {
			await basePage.openPage(labelPage.pageName);
		});

		await test.step('Click the button "Create new Label"', async () => {
			await basePage.getCreateEntityLoc(labelPage.pageName).click();
		});

		await test.step("Create a new label", async () => {
			await labelPage.fillLabelFormByData(label);
			await expectSuccessNotification(page, "Element created");
		});
	});

	test("Header of table contains all required cells", async ({ basePage, labelPage }) => {
		await test.step("Open labels page", async () => {
			await basePage.openPage(labelPage.pageName);
		});

		await test.step("Check that form header elements are displayed", async () => {
			await expect(basePage.headerRowLoc).toBeVisible();
			await expect(basePage.selectAllCheckboxLoc).toBeVisible();

			for (let i = 0; i < labelPage.cellNames.length; i++) {
				await expect(await basePage.getHeaderCellByTextLocator(labelPage.cellNames[i])).toBeVisible();
			}
		});
	});

	test("A label row contains correct data", async ({ basePage, labelPage }) => {
		await test.step("Open labels page", async () => {
			await basePage.openPage(labelPage.pageName);
		});

		await test.step("Check that label page contains correct data", async () => {
			const rowCellLocOne = await basePage.getRowCellLoc(0, 1);
			const rowCellLocTwo = await basePage.getRowCellLoc(0, 2);
			const rowCellLocThree = await basePage.getRowCellLoc(0, 3);

			await expect(rowCellLocOne).toContainText(basePage.idRegEx);
			await expect(rowCellLocTwo).toContainText(basePage.nameRegEx);
			await expect(rowCellLocThree).toContainText(basePage.dateRegEx);
		});
	});

	test("Task label form has correct elements", async ({ basePage, labelPage }) => {
		const labelId = 1;

		await test.step("Open certain label page", async () => {
			await basePage.openPage(labelPage.pageName, labelId);
		});

		await test.step("Check that label form elements are displayed", async () => {
			await expect(basePage.showButtonLoc).toBeEnabled();
			await expect(basePage.saveButtonLoc).toBeDisabled();
			await expect(labelPage.deleteButtonLoc).toBeEnabled();
			await expect(labelPage.labelNameInputLoc).toBeVisible();
		});
	});

	test("Edit a label with correct data", async ({ basePage, labelPage, page }) => {
		await test.step("Create new label ", async () => {
			const label = "design";

			await test.step("Open labels page", async () => {
				await basePage.openPage(labelPage.pageName);
			});

			await test.step('Click the button "Create new Label"', async () => {
				await basePage.getCreateEntityLoc(labelPage.pageName).click();
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
				await basePage.openPage(labelPage.pageName, labelId);
			});

			await test.step("Edit certain label by valid data", async () => {
				await labelPage.fillLabelFormByData(label2);
				await expectSuccessNotification(page, "Element updated");
				await expect(await basePage.getRowByTextLoc(label2)).toBeVisible();
			});
		});
	});

	test("Delete a label", async ({ basePage, labelPage, page }) => {
		const label = "design";

		await test.step("Create new label ", async () => {
			await test.step("Open labels page", async () => {
				await basePage.openPage(labelPage.pageName);
			});

			await test.step('Click the button "Create new Label"', async () => {
				await basePage.getCreateEntityLoc(labelPage.pageName).click();
			});

			await test.step("Create a new label", async () => {
				await labelPage.fillLabelFormByData(label);
				await expectSuccessNotification(page, "Element created");
			});
		});

		await test.step("Delete the new label", async () => {
			const labelId = 6;

			await test.step("Open certain label page", async () => {
				await basePage.openPage(labelPage.pageName, labelId);
			});

			await test.step("Delete the new label", async () => {
				await labelPage.deleteButtonLoc.click();
				await expectSuccessNotification(page, "Element deleted");
			});

			await test.step("Check that label is not displayed in the table", async () => {
				await basePage.openPage(labelPage.pageName);
				await checkIsEntityInTable(page, label);
			});
		});
	});

	test("Bulk delete labels", async ({ basePage, labelPage, page }) => {
		await test.step("Open labels page", async () => {
			await basePage.openPage(labelPage.pageName);
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
