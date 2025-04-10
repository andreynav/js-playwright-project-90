import { log } from "console";
import { DashboardPage, LoginPage, UserPage, BasePage } from "./co/index.js";
import { loginCredentials, getNewUserData, checkIsEntityInTable, expectSuccessNotification, invalidEmail } from "./helpers/index.js";
import { test, expect } from "@playwright/test";

test.describe("UserPage page tests", () => {
	let userPage;
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
			userPage = new UserPage(page);
			basePage = new BasePage(page);
			createButtonLoc = await basePage.getCreateEntityLoc(userPage.pageName);
		});
	});

	test("Create a new user form contains all required fields", async ({ page }) => {
		await test.step("Open users page", async () => {
			await BasePage.openPage(page, userPage.pageName);
		});

		await test.step('Click the button "Create new user"', async () => {
			await createButtonLoc.click();
		});

		await test.step("Check that users form elements are displayed", async () => {
			await expect(basePage.rootLoc).toBeVisible();
			await expect(userPage.createNewUserEmailInputLoc).toBeVisible();
			await expect(userPage.createNewUserFNameInputLoc).toBeVisible();
			await expect(userPage.createNewUserLNameInputLoc).toBeVisible();
		});
	});

	test("Create a new user", async ({ page }) => {
		const newUser = await getNewUserData();

		await test.step("Open users page", async () => {
			await BasePage.openPage(page, userPage.pageName);
		});

		await test.step('Click the button "Create new user"', async () => {
			await createButtonLoc.click();
		});

		await test.step("Create a new user", async () => {
			await userPage.fillUserFormByData(newUser);
			await expectSuccessNotification(page, "Element created");
		});

		await test.step("Check that user is displayed in the table", async () => {
			await BasePage.openPage(page, userPage.pageName);
			await checkIsEntityInTable(page, newUser.email, true);
		});
	});

	test("Header of table contains all required cells", async ({ page }) => {
		await test.step("Open users page", async () => {
			await BasePage.openPage(page, userPage.pageName);
		});

		await test.step("Check that form header elements are displayed", async () => {
			await expect(basePage.headerRowLoc).toBeVisible();
			await expect(basePage.selectAllCheckboxLoc).toBeVisible();

			for (let i = 0; i < userPage.cellNames.length; i++) {
				await expect(await BasePage.getHeaderCellByTextLocator(page, userPage.cellNames[i])).toBeVisible();
			}
		});
	});

	test("Table of users has rows", async ({ page }) => {
		await test.step("Open users page", async () => {
			await BasePage.openPage(page, userPage.pageName);
		});

		await test.step("Check that users more than one in the table", async () => {
			await expect(basePage.rowLoc.first()).toBeVisible();

			const count = await basePage.rowLoc.count();
			await expect(count > 1).toBeTruthy();
		});
	});

	test("A user row contains correct data", async ({ page }) => {
		await test.step("Open users page", async () => {
			await BasePage.openPage(page, userPage.pageName);
		});

		await test.step("Check that user contains correct data", async () => {
            const rowCellLocOne = await BasePage.getRowCellLoc(page, 0, 1);
            const rowCellLocTwo = await BasePage.getRowCellLoc(page, 0, 2);
            const rowCellLocThree = await BasePage.getRowCellLoc(page, 0, 3);
            const rowCellLocFour = await BasePage.getRowCellLoc(page, 0, 4);
            const rowCellLocFive = await BasePage.getRowCellLoc(page, 0, 5);

			await expect(rowCellLocOne).toContainText(BasePage.idRegEx);
			await expect(rowCellLocTwo).toContainText(userPage.emailRegEx);
			await expect(rowCellLocThree).toContainText(BasePage.nameRegEx);
			await expect(rowCellLocFour).toContainText(BasePage.nameRegEx);
			await expect(rowCellLocFive).toContainText(BasePage.dateRegEx);
		});
	});

	test("Edit user form has correct elements", async ({ page }) => {
        const userId = 1;

		await test.step("Open certain user page", async () => {
            await BasePage.openPage(page, userPage.pageName, userId);
		});

		await test.step("Check that user form elements are displayed", async () => {
			await expect(basePage.showButtonLoc).toBeEnabled();
			await expect(basePage.saveButtonLoc).toBeDisabled();
			await expect(userPage.deleteButtonLoc).toBeEnabled();
			await expect(userPage.createNewUserEmailInputLoc).toBeVisible();
			await expect(userPage.createNewUserFNameInputLoc).toBeVisible();
			await expect(userPage.createNewUserLNameInputLoc).toBeVisible();
		});
	});

	test("Edit a user with correct data", async ({ page }) => {
		const newUser = await getNewUserData();
		const userId = 9;

		await test.step("Create a new user", async () => {
			await test.step("Open users page", async () => {
				await BasePage.openPage(page, userPage.pageName);
			});

			await test.step('Click the button "Create new user"', async () => {
				await createButtonLoc.click();
			});

			await test.step("Create a new user", async () => {
				await userPage.fillUserFormByData(newUser);
				await expectSuccessNotification(page, "Element created");
			});
		});

		const newUser2 = await getNewUserData();

		await test.step("Edit the new user with valid data", async () => {
			await test.step("Open certain user page", async () => {
				await BasePage.openPage(page, userPage.pageName, userId);
			});

			await test.step("Edit certain user by valid data", async () => {
				await userPage.fillUserFormByData(newUser2);
				await expectSuccessNotification(page, "Element updated");
				await expect(await BasePage.getRowByTextLoc(page, newUser2.email)).toBeVisible();
			});
		});
	});

	test("Edit a user with incorrect email", async ({ page }) => {
		const newUser = await getNewUserData();
		const userId = 9;

		await test.step("Create a new user", async () => {
			await test.step("Open users page", async () => {
				await BasePage.openPage(page, userPage.pageName);
			});

			await test.step('Click the button "Create new user"', async () => {
				await createButtonLoc.click();
			});

			await test.step("Create a new user", async () => {
				await userPage.fillUserFormByData(newUser);
				await expectSuccessNotification(page, "Element created");
			});
		});

		const newUser2 = await getNewUserData();

		await test.step("Edit the new user with invalid data", async () => {
			await test.step("Open certain user page", async () => {
                await BasePage.openPage(page, userPage.pageName, userId);
			});

			await test.step("Edit certain user by invalid data", async () => {
				await userPage.fillUserFormByData({ ...newUser2, email: invalidEmail });
				await expect(userPage.validateEmailFieldLoc).toBeVisible();
			});
		});
	});

	test("Delete a user", async ({ page }) => {
		const newUser = await getNewUserData();
		const userId = 9;

		await test.step("Create a new user", async () => {
			await test.step("Open users page", async () => {
				await BasePage.openPage(page, userPage.pageName);
			});

			await test.step('Click the button "Create new user"', async () => {
				await createButtonLoc.click();
			});

			await test.step("Create a new user", async () => {
				await userPage.fillUserFormByData(newUser);
				await expectSuccessNotification(page, "Element created");
			});
		});

		await test.step("Delete the new user", async () => {
			await test.step("Open certain user page", async () => {
                await BasePage.openPage(page, userPage.pageName, userId);
			});

			await test.step("Delete the new user", async () => {
				await userPage.deleteButtonLoc.click();
				await expectSuccessNotification(page, "Element deleted");
			});

			await test.step("Check that user is not displayed in the table", async () => {
				await BasePage.openPage(page, userPage.pageName);
				await checkIsEntityInTable(page, newUser.email);
			});
		});
	});

	test("Bulk delete users", async ({ page }) => {
		await test.step("Open users page", async () => {
			await BasePage.openPage(page, userPage.pageName);
		});

		await test.step('Click the button "Select All"', async () => {
			await basePage.selectAllCheckboxLoc.click();
			await expectSuccessNotification(page, "items selected");
		});

		await test.step("Click the button Delete", async () => {
			await userPage.deleteButtonLoc.click();
		});

		await test.step("Check empty users list", async () => {
			await expect(userPage.emptyUsersLoc).toBeVisible();
		});
	});
});
