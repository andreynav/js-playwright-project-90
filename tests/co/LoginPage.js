import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
	constructor(page) {
		super(page);
		this.page = page;
		this.pageName = "loginPage";

		this.root = page.locator("div.MuiPaper-root.MuiCard-root.RaLogin-card");
		this.inputUsername = page.getByRole("textbox", { name: "Username" });
		this.inputPassword = page.getByRole("textbox", { name: "Password" });
		this.buttonSignIn = page.getByRole("button", { name: "Sign in" });
	}

	async login(userCredentials) {
		await this.inputUsername.fill(userCredentials.username);
		await this.inputPassword.fill(userCredentials.password);
		await this.buttonSignIn.click();
	}
}
