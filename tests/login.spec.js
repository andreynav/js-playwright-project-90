import { test, expect } from "@playwright/test";
import { LoginPage, DashboardPage } from "./co/index.js"

test.describe('Login page tests', () => {
    let loginPage;
    const userCredentials = {
        username: 'username',
        password: 'password',
    };

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
    });

    test('Login form is present', async () => {
        await expect(loginPage.rootDivLocator).toBeVisible();
        await expect(loginPage.usernameInputLoc).toBeVisible();
        await expect(loginPage.passwordInputLoc).toBeVisible();
        await expect(loginPage.signInButtonLoc).toBeVisible();
    });

    test("Login buy user credentials is successful", async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await loginPage.login(userCredentials);

        await expect(dashboardPage.dashboardTitleLoc).toBeVisible();
    });

    test('Logout user', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await loginPage.login(userCredentials);

        await expect(dashboardPage.dashboardTitleLoc).toBeVisible();

        await dashboardPage.profileButtonLoc.click();
        await dashboardPage.logoutButtonLoc.click();

        await expect(loginPage.rootDivLocator).toBeVisible();
    });
});
