import { test, expect } from '@playwright/test';

test.setTimeout(60000); // Increase timeout to 60 seconds

test('buyer app loads and smart shopper input is visible', async ({ page }) => {
  await page.goto('https://muoamzih.manus.space');
  await expect(page.locator('text=Smart Shopper')).toBeVisible();
  await expect(page.locator('textarea[placeholder*="I need ingredients"]')).toBeVisible();
});

test('smart shopper can process input and show recommendations', async ({ page }) => {
  await page.goto('https://muoamzih.manus.space');
  await page.locator('textarea[placeholder*="I need ingredients"]').fill('I need ingredients for jollof rice');
  await page.locator('button:has-text("Find Products")').click();
  // Assuming a loading indicator or a section where recommendations appear
  await expect(page.locator('text=AI-Powered Recommendations')).toBeVisible();
  // Further assertions can be added here to check for actual product recommendations
});


