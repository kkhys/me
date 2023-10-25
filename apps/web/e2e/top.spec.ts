import { expect, test } from '@playwright/test';

test.describe('Top page', () => {
  const path = '/';

  test('has title', async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveTitle(/kkhys.me/);
  });
});
