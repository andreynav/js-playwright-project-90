import { test, expect } from "./co/co.js";

test.describe("LabelPage tests", () => {
	test("Create a label form contains all required fields", async ({ basePage, labelPage }) => {
		await test.step("Open labels page", async () => {
			await basePage.openPage(labelPage.pageName);
		});

		await test.step('Click the button "Create new Label"', async () => {
			await basePage.getCreateEntityLoc(labelPage.pageName).click();
		});

		await test.step("Check that new Label form elements are displayed", async () => {
			await expect(basePage.root).toBeVisible();
			await expect(labelPage.inputName).toBeVisible();
			await expect(basePage.saveButton).toBeVisible();
		});
	});

	test("Create new label", async ({ basePage, labelPage }) => {
		const label = "design";

		await test.step("Open labels page", async () => {
			await basePage.openPage(labelPage.pageName);
		});

		await test.step('Click the button "Create new Label"', async () => {
			await basePage.getCreateEntityLoc(labelPage.pageName).click();
		});

		await test.step("Create a new label", async () => {
			await labelPage.fillLabelForm(label);
			await basePage.expectNotification("Element created");
		});
	});

	test("Header of table contains all required cells", async ({ basePage, labelPage }) => {
		await test.step("Open labels page", async () => {
			await basePage.openPage(labelPage.pageName);
		});

		await test.step("Check that form header elements are displayed", async () => {
			await expect(basePage.headerRow).toBeVisible();
			await expect(basePage.checkboxSelectAll).toBeVisible();

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
			const rowCellLocOne = await basePage.getRowCellLocator(0, 1);
			const rowCellLocTwo = await basePage.getRowCellLocator(0, 2);
			const rowCellLocThree = await basePage.getRowCellLocator(0, 3);

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
			await expect(basePage.showButton).toBeEnabled();
			await expect(basePage.saveButton).toBeDisabled();
			await expect(labelPage.deleteButton).toBeEnabled();
			await expect(labelPage.inputName).toBeVisible();
		});
	});

	test("Edit a label with correct data", async ({ basePage, labelPage }) => {
		await test.step("Create new label ", async () => {
			const label = "design";

			await test.step("Open labels page", async () => {
				await basePage.openPage(labelPage.pageName);
			});

			await test.step('Click the button "Create new Label"', async () => {
				await basePage.getCreateEntityLoc(labelPage.pageName).click();
			});

			await test.step("Create a new label", async () => {
				await labelPage.fillLabelForm(label);
				await basePage.expectNotification("Element created");
			});
		});

		await test.step("Edit the new label with valid data", async () => {
			const label2 = "analisys";
			const labelId = 6;

			await test.step("Open certain label page", async () => {
				await basePage.openPage(labelPage.pageName, labelId);
			});

			await test.step("Edit certain label by valid data", async () => {
				await labelPage.fillLabelForm(label2);
				await basePage.expectNotification("Element updated");
				await expect(await basePage.getRowLocatorByText(label2)).toBeVisible();
			});
		});
	});

	test("Delete a label", async ({ basePage, labelPage }) => {
		const label = "design";

		await test.step("Create new label ", async () => {
			await test.step("Open labels page", async () => {
				await basePage.openPage(labelPage.pageName);
			});

			await test.step('Click the button "Create new Label"', async () => {
				await basePage.getCreateEntityLoc(labelPage.pageName).click();
			});

			await test.step("Create a new label", async () => {
				await labelPage.fillLabelForm(label);
				await basePage.expectNotification("Element created");
			});
		});

		await test.step("Delete the new label", async () => {
			const labelId = 6;

			await test.step("Open certain label page", async () => {
				await basePage.openPage(labelPage.pageName, labelId);
			});

			await test.step("Delete the new label", async () => {
				await labelPage.deleteButton.click();
				await basePage.expectNotification("Element deleted");
			});

			await test.step("Check that label is not displayed in the table", async () => {
				await basePage.openPage(labelPage.pageName);
				await basePage.expectVisibility(label, false);
			});
		});
	});

	test("Bulk delete labels", async ({ basePage, labelPage }) => {
		await test.step("Open labels page", async () => {
			await basePage.openPage(labelPage.pageName);
		});

		await test.step('Click the button "Select All"', async () => {
			await basePage.checkboxSelectAll.click();
			await basePage.expectNotification("tems selected");
		});

		await test.step("Click the button Delete", async () => {
			await labelPage.deleteButton.click();
		});

		await test.step("Check empty labels list", async () => {
			await expect(labelPage.emptyLabels).toBeVisible();
		});
	});
});
