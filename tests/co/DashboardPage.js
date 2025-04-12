export class DashboardPage {
	constructor(page) {
		this.page = page;
		this.title = page.getByRole("heading", { name: "Welcome to the administration" });
		this.buttonProfile = page.getByRole("button", { name: "Profile" });
		this.buttonLogout = page.getByRole("menuitem", { name: "Logout" });
	}
}
