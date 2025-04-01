import { expect } from "@playwright/test";

export const getNewUserData = async () => {
    const timestamp = new Date().getTime();
    return {
        email: `${timestamp}@google.com`,
        firstName: `${timestamp}FirstName`,
        lastName: `${timestamp}LastName`
    };
};

export const checkIsEntityInTable = async (page, entityData, isPresent) => {
    const row = await page.getRowByTextLocator(entityData);
    return isPresent ? expect(row).toBeVisible() : expect(row).not.toBeVisible();
}

export const expectSuccessNotification = async (page, text) => {
    return expect(await page.getSuccessNotification(text)).toBeVisible();
}

export const getNewTaskData = async (status, label) => {
    const timestamp = new Date().getTime();
    return {
        assignee: 'john@google.com',
        title: `${timestamp}title`,
        content: `${timestamp}content`,
        status: status,
        label: label
    };
}
