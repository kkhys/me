import { expect, test } from '@playwright/test';
import { checkA11y, injectAxe } from 'axe-playwright';

test.describe('Top page', () => {
  const path = '/';

  test('has title', async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveTitle(/kkhys.me/);
  });

  test('accessibility verification', async ({ page }) => {
    await page.goto(path);
    await injectAxe(page);
    await checkA11y(page);
  });
});
