import { test, expect } from "./co/co.js";
import data from "./data/testData.js";

const { loginCredentials } = data;

test.describe("Login page tests", () => {
	test("Login form is present", async ({ loginPage }) => {
		await test.step("Check that login form elements are displayed", async () => {
			await expect(loginPage.root).toBeVisible();
			await expect(loginPage.inputUsername).toBeVisible();
			await expect(loginPage.inputPassword).toBeVisible();
			await expect(loginPage.buttonSignIn).toBeVisible();
		});
	});

	test("Login by user credentials is successful", async ({ loginPage, dashboardPage }) => {
		await test.step("Log in with credentials", async () => {
			await loginPage.login(loginCredentials);
		});

		await test.step("Check that logged in successfully", async () => {
			await expect(dashboardPage.title).toBeVisible();
		});
	});

	test("Logout user", async ({ loginPage, dashboardPage }) => {
		await test.step("Log in with credentials", async () => {
			await loginPage.login(loginCredentials);
		});

		await test.step("Check that log out is successful", async () => {
			await dashboardPage.buttonProfile.click();
			await dashboardPage.buttonLogout.click();
			await expect(loginPage.root).toBeVisible();
		});
	});
});
