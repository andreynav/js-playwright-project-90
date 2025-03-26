import { test, expect } from "@playwright/test";

test("The App render successful", async ({ page }) => {
    await page.goto('http://localhost:5173/#/login');

    const username = page.getByRole('textbox', { name: 'Username' })
    const password = page.getByRole('textbox', { name: 'Password' })
    const button = page.getByRole('button', { name: 'Sign in'});

    await expect(username).toBeVisible();
    await expect(password).toBeVisible();
    await expect(button).toBeVisible();
});
