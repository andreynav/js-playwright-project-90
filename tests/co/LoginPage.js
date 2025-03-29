export class LoginPage {

    constructor(page) {
        this.page = page;
        this.rootDivLoc = page.locator('div.MuiPaper-root.MuiCard-root.RaLogin-card');
        this.usernameInputLoc = page.getByRole('textbox', { name: 'Username' });
        this.passwordInputLoc = page.getByRole('textbox', { name: 'Password' });
        this.signInButtonLoc = page.getByRole('button', { name: 'Sign in'});
    }

    async open() {
        await this.page.goto('/#/login');
    }

    async login(userCredentials) {
        await this.usernameInputLoc.fill(userCredentials.username);
        await this.passwordInputLoc.fill(userCredentials.password);
        await this.signInButtonLoc.click();
    }
}

