import { test, expect } from "./co/co.js";
import { loginCredentials } from "./helpers/testData.js";

test.describe("Login page tests", () => {
	test("Login form is present", async ({ loginPage }) => {
		await test.step("Check that login form elements are displayed", async () => {
			await expect(loginPage.rootLoc).toBeVisible();
			await expect(loginPage.usernameInputLoc).toBeVisible();
			await expect(loginPage.passwordInputLoc).toBeVisible();
			await expect(loginPage.signInButtonLoc).toBeVisible();
		});
	});

	test("Login by user credentials is successful", async ({ loginPage, dashboardPage }) => {
		await test.step("Check that logged in successfully", async () => {
			await loginPage.login(loginCredentials);

			await expect(dashboardPage.dashboardTitleLoc).toBeVisible();
		});
	});

	test("Logout user", async ({ loginPage, dashboardPage }) => {
		await test.step("Check that log out is successful", async () => {
			await loginPage.login(loginCredentials);
			await dashboardPage.profileButtonLoc.click();
			await dashboardPage.logoutButtonLoc.click();

			await expect(loginPage.rootLoc).toBeVisible();
		});
	});
});
