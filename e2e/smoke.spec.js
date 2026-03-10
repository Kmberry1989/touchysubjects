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

test('enum parameters show available options in the control panel', async ({ page }) => {
  await page.goto('/?mode=library');
  await page.getByRole('button', { name: /bobble spring/i }).click();

  const optionPanel = page.locator('details').filter({ hasText: /Options \(\d+\)/ }).first();
  await expect(optionPanel).toBeVisible();
  await expect(optionPanel.locator('span', { hasText: 'Assembly Tool' }).first()).toBeVisible();
});

test('external import models show immediate blocked-render guidance', async ({ page }) => {
  await page.goto('/?mode=library');
  await page.getByRole('button', { name: /award factory pro/i }).click();

  await expect(page.getByText('Dependency status: Needs file input')).toBeVisible();
  await expect(page.getByText('Render Blocked')).toBeVisible();
  await expect(page.getByText(/Missing external asset file\(s\):/).first()).toBeVisible();
});

test('external import models are unblocked after uploading required asset file', async ({ page }) => {
  await page.goto('/?mode=library');
  await page.getByRole('button', { name: /award factory pro/i }).click();

  await expect(page.getByText('Render Blocked')).toBeVisible();
  await page.locator('input[data-testid="external-asset-input"]').setInputFiles('e2e/fixtures/design.svg');

  const assetPanel = page.locator('[data-testid="external-asset-panel"]');
  await expect(page.getByText('Render Blocked')).toHaveCount(0);
  await expect(assetPanel.locator('span.font-mono', { hasText: 'design.svg' }).first()).toBeVisible();
  await expect(assetPanel.getByText(/^Provided/).first()).toBeVisible();
});
