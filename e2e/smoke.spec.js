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

test('scad library mode renders catalog and duplicate badges', async ({ page }) => {
  await page.goto('/?mode=library');

  await expect(page.getByText(/SCAD Library \(\d+\)/)).toBeVisible();
  await expect(page.getByText(/Exact duplicate of/i).first()).toBeVisible();
});

test('scad library mode does not emit NaN input warnings', async ({ page }) => {
  const nanWarnings = [];
  page.on('console', (msg) => {
    if (msg.text().includes('Received NaN for the `value` attribute')) {
      nanWarnings.push(msg.text());
    }
  });

  await page.goto('/?mode=library');
  await expect(page.getByText(/SCAD Library \(\d+\)/)).toBeVisible();

  expect(nanWarnings).toHaveLength(0);
});

test('number parameter edits do not emit NaN warnings', async ({ page }) => {
  const nanWarnings = [];
  page.on('console', (msg) => {
    if (msg.text().includes('Received NaN for the `value` attribute')) {
      nanWarnings.push(msg.text());
    }
  });

  await page.goto('/?mode=library');
  const numberInput = page.locator('input[type="number"]').first();
  await expect(numberInput).toBeVisible();

  await numberInput.click();
  await numberInput.press('ControlOrMeta+a');
  await numberInput.type('-');

  expect(nanWarnings).toHaveLength(0);
});
