import { BasePage } from "./BasePage";
import { DashboardPage } from "./DashboardPage";
import { LabelPage } from "./LabelPage";
import { LoginPage } from "./LoginPage";
import { TaskPage } from "./TaskPage";
import { TaskStatusesPage } from "./TaskStatusesPage";
import { UserPage } from "./UserPage";
import data from "../data/testData";
import { test as base, expect } from "@playwright/test";

const { loginCredentials } = data;

async function loginAndVerify(loginPage, dashboardPage) {
	await test.step("Log in with credentials", async () => {
		await loginPage.login(loginCredentials);
	});

	await test.step("Check that logged in successfully", async () => {
		await expect(dashboardPage.dashboardTitleLoc).toBeVisible();
	});
}

const test = base.extend({
	loginPage: async ({ page, basePage }, use) => {
		const loginPage = new LoginPage(page);

		await test.step("Open login page", async () => {
			await basePage.openPage(loginPage.pageName);
		});

		await use(loginPage);
	},
	basePage: async ({ page }, use) => {
		await use(new BasePage(page));
	},
	dashboardPage: async ({ page }, use) => {
		await use(new DashboardPage(page));
	},
	userPage: async ({ page, loginPage, dashboardPage }, use) => {
		await loginAndVerify(loginPage, dashboardPage);
		await use(new UserPage(page));
	},
	taskPage: async ({ page, loginPage, dashboardPage }, use) => {
		await loginAndVerify(loginPage, dashboardPage);
		await use(new TaskPage(page));
	},
	taskStatusesPage: async ({ page, loginPage, dashboardPage }, use) => {
		await loginAndVerify(loginPage, dashboardPage);
		await use(new TaskStatusesPage(page));
	},
	labelPage: async ({ page, loginPage, dashboardPage }, use) => {
		await loginAndVerify(loginPage, dashboardPage);
		await use(new LabelPage(page));
	},
});

export { test };
export { expect } from "@playwright/test";
