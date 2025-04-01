import { test, expect } from "@playwright/test";
import { DashboardPage,
    LoginPage,
    TaskStatusesPage
} from "./co/index.js"
import {
    loginCredentials,
    expectSuccessNotification,
    checkIsEntityInTable,
} from "./helpers/index.js";

test.describe('TasksStatusesPage tests', () => {
    test.describe('Task statuses tests', () => {
        let taskStatusesPage;

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
                taskStatusesPage = new TaskStatusesPage(page);
            });
        });

        test('Create a new task status form contains all required fields', async () => {
            await test.step('Open task statuses page', async () => {
                await taskStatusesPage.openTaskStatusesPage();
            });

            await test.step('Click the button "Create new task status"', async () => {
                await taskStatusesPage.newTaskStatusCreateLoc.click();
            });

            await test.step('Check that new task status form elements are displayed', async () => {
                await expect(taskStatusesPage.rootDivLoc).toBeVisible();
                await expect(taskStatusesPage.statusNameInputLoc).toBeVisible();
                await expect(taskStatusesPage.statusSlugInputLoc).toBeVisible();
                await expect(taskStatusesPage.saveButtonLoc).toBeVisible();
            });
        });

        test('Create new task status', async () => {
            const status = { name: 'To Design', slug: 'to_design' };

            await test.step('Open task statuses page', async () => {
                await taskStatusesPage.openTaskStatusesPage();
            });

            await test.step('Click the button "Create new task status"', async () => {
                await taskStatusesPage.newTaskStatusCreateLoc.click();
            });

            await test.step('Create a new task status', async () => {
                await taskStatusesPage.fillTaskStatusFormByData(status);
                await expectSuccessNotification(taskStatusesPage, 'Element created');
            });
        });

        test('Header of table contains all required cells', async () => {
            await test.step('Open task statuses page', async () => {
                await taskStatusesPage.openTaskStatusesPage();
            });

            await test.step('Check that form header elements are displayed', async () => {
                await expect(taskStatusesPage.headerRowLoc).toBeVisible();
                await expect(taskStatusesPage.selectAllCheckboxLoc).toBeVisible();

                for (let i = 0; i < taskStatusesPage.cellNames.length; i++) {
                    await expect(await taskStatusesPage.getHeaderCellByTextLocator(taskStatusesPage.cellNames[i])).toBeVisible();
                }
            });
        });

        test('A status row contains correct data', async () => {
            await test.step('Open task statuses page', async () => {
                await taskStatusesPage.openTaskStatusesPage();
            });

            await test.step('Check that task statuses page contains correct data', async () => {
                await expect(await taskStatusesPage.getRowCellLoc(0, 1)).toContainText(taskStatusesPage.idRegEx);
                await expect(await taskStatusesPage.getRowCellLoc(0, 2)).toContainText(taskStatusesPage.nameRegEx);
                await expect(await taskStatusesPage.getRowCellLoc(0, 3)).toContainText(taskStatusesPage.slugRegEx);
                await expect(await taskStatusesPage.getRowCellLoc(0, 4)).toContainText(taskStatusesPage.dateRegEx);
            });
        });

        test('Task statuses form has correct elements', async () => {
            await test.step('Open certain user page', async () => {
                await taskStatusesPage.openTaskStatusPage(1);
            });

            await test.step('Check that task status form elements are displayed', async () => {
                await expect(taskStatusesPage.showButtonLoc).toBeEnabled();
                await expect(taskStatusesPage.saveButtonLoc).toBeDisabled();
                await expect(taskStatusesPage.deleteButtonLoc).toBeEnabled();
                await expect(taskStatusesPage.statusNameInputLoc).toBeVisible();
                await expect(taskStatusesPage.statusSlugInputLoc).toBeVisible();
            });
        });

        test('Edit a status with correct data', async () => {
            await test.step('Create new task status', async () => {
                const status = { name: 'To Design', slug: 'to_design' };

                await test.step('Open task statuses page', async () => {
                    await taskStatusesPage.openTaskStatusesPage();
                });

                await test.step('Click the button "Create new task status"', async () => {
                    await taskStatusesPage.newTaskStatusCreateLoc.click();
                });

                await test.step('Create a new task status', async () => {
                    await taskStatusesPage.fillTaskStatusFormByData(status);
                    await expectSuccessNotification(taskStatusesPage, 'Element created');
                });
            });

            await test.step('Edit the new task status with valid data', async () => {
                const status2 = { name: 'To Analist', slug: 'to_analist' };
                const statusId = 6;

                await test.step('Open certain task status page', async () => {
                    await taskStatusesPage.openTaskStatusPage(statusId);
                });

                await test.step('Edit certain task status by valid data', async () => {
                    await taskStatusesPage.fillTaskStatusFormByData( status2);
                    await expectSuccessNotification(taskStatusesPage, 'Element updated');
                    await expect( await taskStatusesPage.getRowByTextLocator(status2.name)).toBeVisible();
                });
            });
        });

        test('Delete a task status', async () => {
            const status = { name: 'To Design', slug: 'to_design' };

            await test.step('Create new task status', async () => {
                await test.step('Open task statuses page', async () => {
                    await taskStatusesPage.openTaskStatusesPage();
                });

                await test.step('Click the button "Create new task status"', async () => {
                    await taskStatusesPage.newTaskStatusCreateLoc.click();
                });

                await test.step('Create a new task status', async () => {
                    await taskStatusesPage.fillTaskStatusFormByData(status);
                    await expectSuccessNotification(taskStatusesPage, 'Element created');
                });
            });

            await test.step('Delete the new task status', async () => {
                const statusId = 6;

                await test.step('Open certain task status page', async () => {
                    await taskStatusesPage.openTaskStatusPage(statusId);
                });

                await test.step('Delete the new status', async () => {
                    await taskStatusesPage.deleteButtonLoc.click();
                    await expectSuccessNotification(taskStatusesPage, 'Element deleted');
                });

                await test.step('Check that status is not displayed in the table', async () => {
                    await taskStatusesPage.openTaskStatusesPage();
                    await checkIsEntityInTable(taskStatusesPage, status.name);
                });
            });
        });

        test('Bulk delete statuses', async () => {
            await test.step('Open task statuses page', async () => {
                await taskStatusesPage.openTaskStatusesPage();
            });

            await test.step('Click the button "Select All"', async () => {
                await taskStatusesPage.selectAllCheckboxLoc.click();
                await expectSuccessNotification(taskStatusesPage, 'items selected');
            });

            await test.step('Click the button Delete', async () => {
                await taskStatusesPage.deleteButtonLoc.click();
            });

            await test.step('Check empty statuses list', async () => {
                await expect( taskStatusesPage.emptyStatusesLoc).toBeVisible();
            });
        });
    });
});
