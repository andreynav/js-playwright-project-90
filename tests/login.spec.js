import { test, expect } from "@playwright/test";
import { LoginPage, DashboardPage, BasePage } from "./co/index.js"
import { loginCredentials } from "./helpers/testData.js"

test.describe('Login page tests', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        await test.step("Open login page", async () => {
            loginPage = new LoginPage(page);
            await BasePage.openPage(page, loginPage.pageName);
        });
    });

    test('Login form is present', async () => {
        await test.step("Check that login form elements are displayed", async () => {
            await expect(loginPage.rootLoc).toBeVisible();
            await expect(loginPage.usernameInputLoc).toBeVisible();
            await expect(loginPage.passwordInputLoc).toBeVisible();
            await expect(loginPage.signInButtonLoc).toBeVisible();
        });
    });

    test("Login by user credentials is successful", async ({ page }) => {
        await test.step("Check that logged in successfully", async () => {
            const dashboardPage = new DashboardPage(page);
            await loginPage.login(loginCredentials);

            await expect(dashboardPage.dashboardTitleLoc).toBeVisible();
        });
    });

    test('Logout user', async ({ page }) => {
        await test.step("Check that log out is successful", async () => {
            const dashboardPage = new DashboardPage(page);
            await loginPage.login(loginCredentials);
            await dashboardPage.profileButtonLoc.click();
            await dashboardPage.logoutButtonLoc.click();

            await expect(loginPage.rootLoc).toBeVisible();
        });
    });
});
