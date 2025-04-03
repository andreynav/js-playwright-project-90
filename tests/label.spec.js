import { DashboardPage, LoginPage } from "./co/index.js";
import { LabelPage } from "./co/LabelPage.js";
import { loginCredentials, expectSuccessNotification, checkIsEntityInTable } from "./helpers/index.js";
import { test, expect } from "@playwright/test";

test.describe("LabelPage tests", () => {
    let labelPage;

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
            labelPage = new LabelPage(page);
        });
    });

    test('Create a label form contains all required fields', async () => {
        await test.step('Open labels page', async () => {
            await labelPage.openLabelsPage();
        });

        await test.step('Click the button "Create new Label"', async () => {
            await labelPage.newLabelCreateLoc.click();
        });

        await test.step('Check that new Label form elements are displayed', async () => {
            await expect(labelPage.rootDivLoc).toBeVisible();
            await expect(labelPage.labelNameInputLoc).toBeVisible();
            await expect(labelPage.saveButtonLoc).toBeVisible();
        });
    });

    test('Create new label', async () => {
        const label = 'design';

        await test.step('Open labels page', async () => {
            await labelPage.openLabelsPage();
        });

        await test.step('Click the button "Create new Label"', async () => {
            await labelPage.newLabelCreateLoc.click();
        });

        await test.step('Create a new label', async () => {
            await labelPage.fillLabelFormByData(label);
            await expectSuccessNotification(labelPage, 'Element created');
        });
    });

    test('Header of table contains all required cells', async () => {
        await test.step('Open labels page', async () => {
            await labelPage.openLabelsPage();
        });

        await test.step('Check that form header elements are displayed', async () => {
            await expect(labelPage.headerRowLoc).toBeVisible();
            await expect(labelPage.selectAllCheckboxLoc).toBeVisible();

            for (let i = 0; i < labelPage.cellNames.length; i++) {
                await expect(await labelPage.getHeaderCellByTextLocator(labelPage.cellNames[i])).toBeVisible();
            }
        });
    });

    test('A label row contains correct data', async () => {
        await test.step('Open labels page', async () => {
            await labelPage.openLabelsPage();
        });

        await test.step('Check that label page contains correct data', async () => {
            await expect(await labelPage.getRowCellLoc(0, 1)).toContainText(labelPage.idRegEx);
            await expect(await labelPage.getRowCellLoc(0, 2)).toContainText(labelPage.nameRegEx);
            await expect(await labelPage.getRowCellLoc(0, 3)).toContainText(labelPage.dateRegEx);
        });
    });

    test('Task label form has correct elements', async () => {
        await test.step('Open certain label page', async () => {
            await labelPage.openLabelPage(1);
        });

        await test.step('Check that label form elements are displayed', async () => {
            await expect(labelPage.showButtonLoc).toBeEnabled();
            await expect(labelPage.saveButtonLoc).toBeDisabled();
            await expect(labelPage.deleteButtonLoc).toBeEnabled();
            await expect(labelPage.labelNameInputLoc).toBeVisible();
        });
    });

    test('Edit a label with correct data', async () => {
        await test.step('Create new label ', async () => {
            const label = 'design';

            await test.step('Open labels page', async () => {
                await labelPage.openLabelsPage();
            });
    
            await test.step('Click the button "Create new Label"', async () => {
                await labelPage.newLabelCreateLoc.click();
            });
    
            await test.step('Create a new label', async () => {
                await labelPage.fillLabelFormByData(label);
                await expectSuccessNotification(labelPage, 'Element created');
            });
        });

        await test.step('Edit the new label with valid data', async () => {
            const label2 = 'analisys';
            const labelId = 6;

            await test.step('Open certain label page', async () => {
                await labelPage.openLabelPage(labelId);
            });

            await test.step('Edit certain label by valid data', async () => {
                await labelPage.fillLabelFormByData(label2);
                await expectSuccessNotification(labelPage, 'Element updated');
                await expect( await labelPage.getRowByTextLocator(label2)).toBeVisible();
            });
        });
    });

    test('Delete a label', async () => {
        const label = 'design';

        await test.step('Create new label ', async () => {
            await test.step('Open labels page', async () => {
                await labelPage.openLabelsPage();
            });
    
            await test.step('Click the button "Create new Label"', async () => {
                await labelPage.newLabelCreateLoc.click();
            });
    
            await test.step('Create a new label', async () => {
                await labelPage.fillLabelFormByData(label);
                await expectSuccessNotification(labelPage, 'Element created');
            });
        });

        await test.step('Delete the new label', async () => {
            const labelId = 6;

            await test.step('Open certain label page', async () => {
                await labelPage.openLabelPage(labelId);
            });

            await test.step('Delete the new label', async () => {
                await labelPage.deleteButtonLoc.click();
                await expectSuccessNotification(labelPage, 'Element deleted');
            });

            await test.step('Check that label is not displayed in the table', async () => {
                await labelPage.openLabelsPage();
                await checkIsEntityInTable(labelPage, label);
            });
        });
    });

    test('Bulk delete labels', async () => {
        await test.step('Open labels page', async () => {
            await labelPage.openLabelsPage();
        });

        await test.step('Click the button "Select All"', async () => {
            await labelPage.selectAllCheckboxLoc.click();
            await expectSuccessNotification(labelPage, 'items selected');
        });

        await test.step('Click the button Delete', async () => {
            await labelPage.deleteButtonLoc.click();
        });

        await test.step('Check empty labels list', async () => {
            await expect( labelPage.emptyLabelsLoc).toBeVisible();
        });
    });
});
