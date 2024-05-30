import { expect, test } from '@playwright/test';

test('navigation smoke test', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Acme Dashboard/);
  await expect(
    page.getByRole('heading', { level: 1, name: /Acme/ }),
  ).toBeVisible();

  // Can go to the login page
  await page.getByRole('link', { name: 'Log in' }).click();

  await expect(page).toHaveTitle(/Log in/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Log in' }),
  ).toBeVisible();
});
