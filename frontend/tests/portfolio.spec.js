import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page, responsive layouts, navigation, project filters and cursor', async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Priyanshu Das');
  await expect(page.locator('main section')).toHaveCount(8);
  for (const width of [1440, 1024, 768, 430, 390, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior))
      .toBe('auto');
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      .toBe(true);
    if (width < 901) {
      const menu = page.getByRole('button', { name: 'Open navigation' });
      await menu.click();
      await expect(page.getByRole('button', { name: 'Close navigation' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'Projects', exact: true })
        .click();
      await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    } else {
      await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'Projects', exact: true })
        .click();
    }
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator('#main-navigation a[href="#projects"]')).toHaveAttribute(
      'aria-current',
      'location',
    );
  }
  await page.getByRole('button', { name: 'API Projects', exact: true }).click();
  await expect(page.locator('.project-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Full Stack', exact: true }).click();
  await expect(page.locator('.project-card')).toHaveCount(1);
  await expect(page.locator('.project-card h3')).toHaveText('Instagram Clone');
  await page.getByText('Explore project features', { exact: true }).click();
  await expect(
    page.getByText('Authentication and social interactions', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: /All Projects/ }).click();
  await expect(page.locator('.project-card')).toHaveCount(4);
  expect(await page.locator('a[href="#"]').count()).toBe(0);
  const external = await page
    .locator('a[target="_blank"]')
    .evaluateAll((links) => links.map((link) => ({ href: link.href, rel: link.rel })));
  expect(
    external.every(
      (link) => link.rel.includes('noopener') && link.href === 'https://github.com/Priyanshu0015',
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.custom-cursor')).toHaveCount(2);
  await page.mouse.move(100, 200, { steps: 5 });
  await expect(page.locator('html')).toHaveClass(/cursor-active/);
  await page.keyboard.press('Tab');
  await expect(page.locator('html')).not.toHaveClass(/cursor-active/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.custom-cursor')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('contact validation, real unconfigured API, and simulated delivery states', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#contact');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByText('Please enter at least 2 characters.')).toBeVisible();
  await expect(page.getByLabel('Your name')).toBeFocused();
  await page.getByLabel('Your name').fill('Test Visitor');
  await page.getByLabel('Your email').fill('visitor@example.com');
  await page.getByLabel('Your message').fill('I would love to discuss a website project.');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByRole('alert')).toContainText('temporarily unavailable');
  await expect(page.getByLabel('Your message')).toHaveValue(
    'I would love to discuss a website project.',
  );
  let requests = 0;
  await page.route('**/api/contact', async (route) => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 350));
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'Message sent successfully.' }),
    });
  });
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByRole('button', { name: 'Sending...' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Message Sent' })).toBeVisible();
  await expect(
    page.getByRole('status').filter({ hasText: 'Message sent successfully!' }),
  ).toBeVisible();
  await expect(page.getByLabel('Your name')).toHaveValue('');
  expect(requests).toBe(1);
});

test('mobile escape navigation and accessibility', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  for (const section of await page.locator('main section').all())
    await section.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    results.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    })),
  ).toEqual([]);
  if (testInfo.project.name === 'chromium') {
    await page.screenshot({ path: 'docs/portfolio-mobile.png', fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: 'docs/portfolio-desktop.png', fullPage: true });
    await page.screenshot({ path: 'docs/portfolio-hero.png' });
  }
});
