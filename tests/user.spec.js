import { test, expect } from "./co/co.js";

test.describe("UserPage page tests", () => {
	test("Create a new user form contains all required fields", async ({ basePage, userPage }) => {
		await test.step("Open users page", async () => {
			await basePage.openPage(userPage.pageName);
		});

		await test.step('Click the button "Create new user"', async () => {
			await basePage.getCreateEntityLoc(userPage.pageName).click();
		});

		await test.step("Check that users form elements are displayed", async () => {
			await expect(basePage.root).toBeVisible();
			await expect(userPage.inputEmail).toBeVisible();
			await expect(userPage.inputFirstName).toBeVisible();
			await expect(userPage.inputLastName).toBeVisible();
		});
	});

	test("Create a new user", async ({ basePage, userPage }) => {
		const newUser = await userPage.getNewUserData();

		await test.step("Open users page", async () => {
			await basePage.openPage(userPage.pageName);
		});

		await test.step('Click the button "Create new user"', async () => {
			await basePage.getCreateEntityLoc(userPage.pageName).click();
		});

		await test.step("Create a new user", async () => {
			await userPage.fillUserForm(newUser);
			await basePage.expectNotification("Element created");
		});

		await test.step("Check that user is displayed in the table", async () => {
			await basePage.openPage(userPage.pageName);
			await basePage.expectVisibility(newUser.email);
		});
	});

	test("Header of table contains all required cells", async ({ basePage, userPage }) => {
		await test.step("Open users page", async () => {
			await basePage.openPage(userPage.pageName);
		});

		await test.step("Check that form header elements are displayed", async () => {
			await expect(basePage.headerRow).toBeVisible();
			await expect(basePage.checkboxSelectAll).toBeVisible();

			for (let i = 0; i < userPage.cellNames.length; i++) {
				await expect(await basePage.getHeaderCellByTextLocator(userPage.cellNames[i])).toBeVisible();
			}
		});
	});

	test("Table of users has rows", async ({ basePage, userPage }) => {
		await test.step("Open users page", async () => {
			await basePage.openPage(userPage.pageName);
		});

		await test.step("Check that users more than one in the table", async () => {
			await expect(basePage.row.first()).toBeVisible();

			const count = await basePage.row.count();
			await expect(count > 1).toBeTruthy();
		});
	});

	test("A user row contains correct data", async ({ basePage, userPage }) => {
		await test.step("Open users page", async () => {
			await basePage.openPage(userPage.pageName);
		});

		await test.step("Check that user contains correct data", async () => {
			const rowCellLocOne = await basePage.getRowCellLocator(0, 1);
			const rowCellLocTwo = await basePage.getRowCellLocator(0, 2);
			const rowCellLocThree = await basePage.getRowCellLocator(0, 3);
			const rowCellLocFour = await basePage.getRowCellLocator(0, 4);
			const rowCellLocFive = await basePage.getRowCellLocator(0, 5);

			await expect(rowCellLocOne).toContainText(basePage.idRegEx);
			await expect(rowCellLocTwo).toContainText(userPage.emailRegEx);
			await expect(rowCellLocThree).toContainText(basePage.nameRegEx);
			await expect(rowCellLocFour).toContainText(basePage.nameRegEx);
			await expect(rowCellLocFive).toContainText(basePage.dateRegEx);
		});
	});

	test("Edit user form has correct elements", async ({ basePage, userPage }) => {
		const userId = 1;

		await test.step("Open certain user page", async () => {
			await basePage.openPage(userPage.pageName, userId);
		});

		await test.step("Check that user form elements are displayed", async () => {
			await expect(basePage.showButton).toBeEnabled();
			await expect(basePage.saveButton).toBeDisabled();
			await expect(userPage.deleteButton).toBeEnabled();
			await expect(userPage.inputEmail).toBeVisible();
			await expect(userPage.inputFirstName).toBeVisible();
			await expect(userPage.inputLastName).toBeVisible();
		});
	});

	test("Edit a user with correct data", async ({ basePage, userPage }) => {
		const newUser = await userPage.getNewUserData();
		const userId = 9;

		await test.step("Create a new user", async () => {
			await test.step("Open users page", async () => {
				await basePage.openPage(userPage.pageName);
			});

			await test.step('Click the button "Create new user"', async () => {
				await basePage.getCreateEntityLoc(userPage.pageName).click();
			});

			await test.step("Create a new user", async () => {
				await userPage.fillUserForm(newUser);
				await basePage.expectNotification("Element created");
			});
		});

		const newUser2 = await userPage.getNewUserData();

		await test.step("Edit the new user with valid data", async () => {
			await test.step("Open certain user page", async () => {
				await basePage.openPage(userPage.pageName, userId);
			});

			await test.step("Edit certain user by valid data", async () => {
				await userPage.fillUserForm(newUser2);
				await basePage.expectNotification("Element updated");
				await expect(await basePage.getRowLocatorByText(newUser2.email)).toBeVisible();
			});
		});
	});

	test("Edit a user with incorrect email", async ({ basePage, userPage }) => {
		const newUser = await userPage.getNewUserData();
		const userId = 9;

		await test.step("Create a new user", async () => {
			await test.step("Open users page", async () => {
				await basePage.openPage(userPage.pageName);
			});

			await test.step('Click the button "Create new user"', async () => {
				await basePage.getCreateEntityLoc(userPage.pageName).click();
			});

			await test.step("Create a new user", async () => {
				await userPage.fillUserForm(newUser);
				await basePage.expectNotification("Element created");
			});
		});

		const newUser2 = await userPage.getNewUserData();

		await test.step("Edit the new user with invalid data", async () => {
			await test.step("Open certain user page", async () => {
				await basePage.openPage(userPage.pageName, userId);
			});

			await test.step("Edit certain user by invalid data", async () => {
				await userPage.fillUserForm({ ...newUser2, email: "1111google.com" });
				await expect(userPage.emailValidationError).toBeVisible();
			});
		});
	});

	test("Delete a user", async ({ basePage, userPage }) => {
		const newUser = await userPage.getNewUserData();
		const userId = 9;

		await test.step("Create a new user", async () => {
			await test.step("Open users page", async () => {
				await basePage.openPage(userPage.pageName);
			});

			await test.step('Click the button "Create new user"', async () => {
				await basePage.getCreateEntityLoc(userPage.pageName).click();
			});

			await test.step("Create a new user", async () => {
				await userPage.fillUserForm(newUser);
				await basePage.expectNotification("Element created");
			});
		});

		await test.step("Delete the new user", async () => {
			await test.step("Open certain user page", async () => {
				await basePage.openPage(userPage.pageName, userId);
			});

			await test.step("Delete the new user", async () => {
				await userPage.deleteButton.click();
				await basePage.expectNotification("Element deleted");
			});

			await test.step("Check that user is not displayed in the table", async () => {
				await basePage.openPage(userPage.pageName);
				await basePage.expectVisibility(newUser.email, false);
			});
		});
	});

	test("Bulk delete users", async ({ basePage, userPage }) => {
		await test.step("Open users page", async () => {
			await basePage.openPage(userPage.pageName);
		});

		await test.step('Click the button "Select All"', async () => {
			await basePage.checkboxSelectAll.click();
			await basePage.expectNotification("items selected");
		});

		await test.step("Click the button Delete", async () => {
			await userPage.deleteButton.click();
		});

		await test.step("Check empty users list", async () => {
			await expect(userPage.emptyUsers).toBeVisible();
		});
	});
});
