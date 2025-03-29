import { test, expect } from "@playwright/test";
import { DashboardPage, LoginPage, UserPage } from "./co/index.js"
import { loginCredentials, getNewUserData, checkIsUserInTable, expectSuccessNotification, invalidEmail } from "./helpers/index.js"

test.describe('UserPage page tests', () => {
    let userPage;

    test.beforeEach(async ({ page }) => {
        let loginPage;

        await test.step('Open login page', async () => {
            loginPage = new LoginPage(page);
            await loginPage.open();
        });

        await test.step('Log in with credentials', async () => {
            await loginPage.login(loginCredentials);
        });

        await test.step('Check that logged in successfully', async () => {
            const dashboardPage = new DashboardPage(page);
            await expect(dashboardPage.dashboardTitleLoc).toBeVisible();
            userPage = new UserPage(page);
        });
    });

    test('Create a new user form contains all required fields', async () => {
        await test.step('Open users page', async () => {
            await userPage.openUsersPage();
        });

        await test.step('Click the button "Create new user"', async () => {
            await userPage.fillUserFormByDataButtonTabLocator.click();
        });

        await test.step('Check that users form elements are displayed', async () => {
            await expect(userPage.rootDivLoc).toBeVisible();
            await expect(userPage.createNewUserEmailInputLoc).toBeVisible();
            await expect(userPage.createNewUserFNameInputLoc).toBeVisible();
            await expect(userPage.createNewUserLNameInputLoc).toBeVisible();
        });
    });

    test('Create a new user', async () => {
        const newUser = await getNewUserData();

        await test.step('Open users page', async () => {
            await userPage.openUsersPage();
        });

        await test.step('Click the button "Create new user"', async () => {
            await userPage.fillUserFormByDataButtonTabLocator.click();
        });

        await test.step('Create a new user', async () => {
            await userPage.fillUserFormByData(newUser);
            await expectSuccessNotification(userPage, 'Element created');
        });

        await test.step('Check that user is displayed in the table', async () => {
            await userPage.openUsersPage();
            await checkIsUserInTable(userPage, newUser.email, true);
        });
    });

    test('Header of table contains all required cells', async () => {
        await test.step('Open users page', async () => {
            await userPage.openUsersPage();
        });

        await test.step('Check that form header elements are displayed', async () => {
            await expect(userPage.headerRowLoc).toBeVisible();
            await expect(userPage.selectAllCheckboxLoc).toBeVisible();

            for (let i = 0; i < userPage.cellNames.length; i++) {
                await expect(await userPage.getHeaderCellByTextLocator(userPage.cellNames[i])).toBeVisible();
            }
        });
    });

    test('Table of users has rows', async () => {
        await test.step('Open users page', async () => {
            await userPage.openUsersPage();
        });

        await test.step('Check that users more than one in the table', async () => {
            await expect(await userPage.rowLoc.count() > 1).toBeTruthy();
        });
    });

    test('A user row contains correct data', async () => {
        await test.step('Open users page', async () => {
            await userPage.openUsersPage();
        });

        await test.step('Check that user contains correct data', async () => {
            await expect(await userPage.getRowCellLoc(0, 1)).toContainText(userPage.idRegEx);
            await expect(await userPage.getRowCellLoc(0, 2)).toContainText(userPage.emailRegEx);
            await expect(await userPage.getRowCellLoc(0, 3)).toContainText(userPage.nameRegEx);
            await expect(await userPage.getRowCellLoc(0, 4)).toContainText(userPage.nameRegEx);
            await expect(await userPage.getRowCellLoc(0,5)).toContainText(userPage.dateRegEx);
        });
    });

    test('Edit user form has correct elements', async () => {
        await test.step('Open certain user page', async () => {
            await userPage.openUserPage(1);
        });

        await test.step('Check that user form elements are displayed', async () => {
            await expect(userPage.showButtonLoc).toBeEnabled();
            await expect(userPage.saveButtonLoc).toBeDisabled();
            await expect(userPage.deleteButtonLoc).toBeEnabled();
            await expect(userPage.createNewUserEmailInputLoc).toBeVisible();
            await expect(userPage.createNewUserFNameInputLoc).toBeVisible();
            await expect(userPage.createNewUserLNameInputLoc).toBeVisible();
        });
    });

    test('Edit a user with correct data', async () => {
        const newUser = await getNewUserData();
        const userId = 9;

        await test.step('Create a new user', async () => {
            await test.step('Open users page', async () => {
                await userPage.openUsersPage();
            });

            await test.step('Click the button "Create new user"', async () => {
                await userPage.fillUserFormByDataButtonTabLocator.click();
            });

            await test.step('Create a new user', async () => {
                await userPage.fillUserFormByData(newUser);
                await expectSuccessNotification(userPage, 'Element created');
            });
        });

        const newUser2 = await getNewUserData();

        await test.step('Edit the new user with valid data', async () => {
            await test.step('Open certain user page', async () => {
                await userPage.openUserPage(userId);
            });

            await test.step('Edit certain user by valid data', async () => {
                await userPage.fillUserFormByData( newUser2);
                await expectSuccessNotification(userPage, 'Element updated');
                await expect( await userPage.getRowByTextLocator(newUser2.email)).toBeVisible();
            });
        });
    });

    test('Edit a user with incorrect email', async () => {
        const newUser = await getNewUserData();
        const userId = 9;

        await test.step('Create a new user', async () => {
            await test.step('Open users page', async () => {
                await userPage.openUsersPage();
            });

            await test.step('Click the button "Create new user"', async () => {
                await userPage.fillUserFormByDataButtonTabLocator.click();
            });

            await test.step('Create a new user', async () => {
                await userPage.fillUserFormByData(newUser);
                await expectSuccessNotification(userPage, 'Element created');
            });
        });

        const newUser2 = await getNewUserData();

        await test.step('Edit the new user with invalid data', async () => {
            await test.step('Open certain user page', async () => {
                await userPage.openUserPage(userId);
            });

            await test.step('Edit certain user by invalid data', async () => {
                await userPage.fillUserFormByData( {...newUser2, email: invalidEmail});
                await expect(userPage.validateEmailFieldLoc).toBeVisible();
            });
        });
    });

    test('Delete a user', async () => {
        const newUser = await getNewUserData();
        const userId = 9;

        await test.step('Create a new user', async () => {
            await test.step('Open users page', async () => {
                await userPage.openUsersPage();
            });

            await test.step('Click the button "Create new user"', async () => {
                await userPage.fillUserFormByDataButtonTabLocator.click();
            });

            await test.step('Create a new user', async () => {
                await userPage.fillUserFormByData(newUser);
                await expectSuccessNotification(userPage, 'Element created');
            });
        });

        await test.step('Delete the new user', async () => {
            await test.step('Open certain user page', async () => {
                await userPage.openUserPage(userId);
            });

            await test.step('Delete the new user', async () => {
                await userPage.deleteButtonLoc.click();
                await expectSuccessNotification(userPage, 'Element deleted');
            });

            await test.step('Check that user is not displayed in the table', async () => {
                await userPage.openUsersPage();
                await checkIsUserInTable(userPage, newUser.email);
            });
        });
    });

    test('Bulk delete users', async () => {
        await test.step('Open users page', async () => {
            await userPage.openUsersPage();
        });

        await test.step('Click the button "Select All"', async () => {
            await userPage.selectAllCheckboxLoc.click();
            await expect(userPage.userSelectedNotificationloc).toBeVisible();
        });

        await test.step('Click the button Delete', async () => {
            await userPage.deleteButtonLoc.click();
            await expect(userPage.emptyUsersLoc).toBeVisible();
        });

        await test.step('Check empty users list', async () => {
            await expect(userPage.emptyUsersLoc).toBeVisible();
        });
    });
});
