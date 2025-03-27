export class DashboardPage {

    constructor(page) {
        this.page = page;
        this.dashboardTitleLoc = page.getByRole('heading', { name: 'Welcome to the administration' });
        this.profileButtonLoc = page.getByRole('button', { name: 'Profile' });
        this.logoutButtonLoc = page.getByRole('menuitem', { name: 'Logout' });
    }

}
