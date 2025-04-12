import { BasePage } from "./BasePage";

export class UserPage extends BasePage {
	constructor(page) {
		super(page);
		this.page = page;
		this.pageName = "userPage";
		this.cellNames = ["id", "Email", "First name", "Last name", "Created at"];

		this.emailRegEx = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i;

		this.emptyUsers = page.getByText("No Users yet");
		this.inputEmail = page.getByRole("textbox", { name: "Email" });
		this.inputFirstName = page.getByRole("textbox", { name: "First name" });
		this.inputLastName = page.getByRole("textbox", { name: "Last name" });
		this.emailValidationError = page.locator("div.ra-input-email").filter({ hasText: "Incorrect email format" });
	}

	async fillUserForm(user) {
		await this.inputEmail.fill(user.email);
		await this.inputFirstName.fill(user.firstName);
		await this.inputLastName.fill(user.lastName);
		await this.saveButton.click();
	}

	async getNewUserData() {
		const timestamp = new Date().getTime();
		return {
			email: `${timestamp}@google.com`,
			firstName: `${timestamp}FirstName`,
			lastName: `${timestamp}LastName`,
		};
	}
}
