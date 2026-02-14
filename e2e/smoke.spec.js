import { test, expect } from '@playwright/test';

test('app loads and generates SCAD output', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Tactile Object Generator' })).toBeVisible();

  await page.getByRole('button', { name: '4. Export' }).click();

  const codeBlock = page.locator('pre').first();
  await expect(codeBlock).toBeVisible();

  const text = await codeBlock.innerText();
  expect(text.length).toBeGreaterThan(200);
  expect(text).toContain('Generated:');
});
