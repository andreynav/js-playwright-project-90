import { expect } from "@playwright/test";

export const getNewUserData = async () => {
    const timestamp = new Date().getTime();
    return {
        email: `${timestamp}@google.com`,
        firstName: `${timestamp}FirstName`,
        lastName: `${timestamp}LastName`
    };
};

export const checkIsUserInTable = async (page, userData, isPresent) => {
    const row = await page.getRowByTextLocator(userData);
    return isPresent ? expect(row).toBeVisible() : expect(row).not.toBeVisible();
}

export const expectSuccessNotification = async (page, text) => {
    return expect(await page.getSuccessNotification(text)).toBeVisible();

}
