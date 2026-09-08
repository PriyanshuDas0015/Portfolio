import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const admin = { id: 'admin-1', username: 'portfolio-admin', email: 'admin@example.com' };
const counts = {
  projects: 4,
  publishedProjects: 4,
  skills: 12,
  certificates: 0,
  experience: 3,
  messages: 1,
  unreadMessages: 1,
};

async function mockAdminApi(page) {
  let signedIn = false;
  let resume = null;
  let settings = null;
  const profile = {
    name: 'Priyanshu Das',
    professionalTitle: 'Frontend Developer',
    shortIntroduction: 'I build useful products.',
    fullAbout: 'A longer profile introduction.',
    location: 'Sonipat, Haryana',
    email: 'priyanshudassonu@gmail.com',
    phone: '',
    profileImageUrl: '',
  };
  await page.route('**/api/admin/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();
    const json = (status, body) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

    if (path.endsWith('/login') && method === 'POST') {
      const body = request.postDataJSON();
      if (body.password !== 'correct-password')
        return json(401, { success: false, message: 'Invalid email or password.' });
      signedIn = true;
      return json(200, { success: true, admin });
    }
    if (path.endsWith('/logout')) {
      signedIn = false;
      return json(200, { success: true });
    }
    if (path.endsWith('/me'))
      return signedIn
        ? json(200, { success: true, admin })
        : json(401, { success: false, message: 'Authentication required.' });
    if (!signedIn) return json(401, { success: false, message: 'Authentication required.' });
    if (path.endsWith('/dashboard')) return json(200, { success: true, counts });
    if (path.endsWith('/profile') && method === 'GET') return json(200, { success: true, profile });
    if (path.endsWith('/settings') && method === 'GET')
      return json(200, { success: true, settings });
    if (path.endsWith('/settings') && method === 'PUT') {
      settings = request.postDataJSON();
      return json(200, { success: true, settings });
    }
    if (path.endsWith('/projects') && method === 'GET')
      return json(200, { success: true, items: [] });
    if (path.endsWith('/projects') && method === 'POST')
      return json(201, { success: true, item: { _id: 'project-1', title: 'Test Project' } });
    if (path.endsWith('/resume') && method === 'GET') return json(200, { success: true, resume });
    if (path.endsWith('/resume') && method === 'POST') {
      resume = {
        _id: 'resume-1',
        fileName: 'resume.pdf',
        fileUrl: 'https://example.com/resume.pdf',
        fileSize: 128,
        uploadedAt: new Date().toISOString(),
      };
      return json(201, { success: true, resume });
    }
    if (path.endsWith('/messages') && method === 'GET')
      return json(200, {
        success: true,
        items: [
          {
            _id: 'message-1',
            name: 'Test Visitor',
            email: 'visitor@example.com',
            message: 'Could we discuss a portfolio project?',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    if (path.endsWith('/messages/message-1/read') && method === 'PUT')
      return json(200, {
        success: true,
        item: {
          _id: 'message-1',
          name: 'Test Visitor',
          email: 'visitor@example.com',
          message: 'Could we discuss a portfolio project?',
          isRead: true,
          createdAt: new Date().toISOString(),
        },
      });
    return json(200, { success: true, items: [] });
  });
  return { signIn: () => (signedIn = true) };
}

test('login, dashboard and core content workflows', async ({ page }) => {
  await mockAdminApi(page);
  await page.goto('/');
  await expect(page).toHaveURL(/\/admin\/login$/);

  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByRole('textbox', { name: /Password/ }).fill('wrong-password');
  await page.getByRole('button', { name: /Login/ }).click();
  await expect(page.getByRole('alert')).toContainText('Invalid email or password');

  await page.getByRole('textbox', { name: /Password/ }).fill('correct-password');
  await page.getByRole('button', { name: /Login/ }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  await expect(page.getByText('12', { exact: true })).toBeVisible();

  await page.goto('/profile');
  await expect(page.getByRole('heading', { name: 'Profile / About' })).toBeVisible();
  await expect(page.getByLabel('Full name *')).toHaveValue('Priyanshu Das');
  await page.goto('/admin/dashboard');

  await page.getByRole('button', { name: /Add Project/ }).click();
  await page.getByRole('button', { name: /Save Project/ }).click();
  await expect(page.getByText('Project title is required.')).toBeVisible();
  await page.getByLabel('Project Title *').fill('Test Project');
  await page.getByLabel('Role *').fill('Developer');
  await page.getByLabel('Project Type').fill('Portfolio Experience');
  await page.getByLabel('Duration').fill('3 Months');
  await page.getByLabel('Completion Year').fill('2026');
  await page.getByLabel('Short Description *').fill('A tested admin-created project.');
  await page.getByLabel('GitHub URL').fill('invalid-url');
  await page.getByRole('button', { name: /Save Project/ }).click();
  await expect(page.getByLabel('GitHub URL')).toHaveJSProperty('validity.valid', false);
  await page.getByLabel('GitHub URL').fill('https://github.com/PriyanshuDas0015');
  await page.getByRole('button', { name: /Save Project/ }).click();
  await expect(page).toHaveURL(/\/projects$/);

  await page.goto('/resume');
  await expect(page.getByRole('heading', { name: 'Resume', exact: true })).toBeVisible();
  await expect(page.getByText('No resume uploaded')).toBeVisible();
  await page.locator('input[type=file]').setInputFiles({
    name: 'resume.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 test'),
  });
  await page.getByRole('button', { name: 'Upload Resume' }).click();
  await expect(page.getByText('resume.pdf')).toBeVisible();

  await page.goto('/messages');
  await page.getByText('Could we discuss a portfolio project?').click();
  await expect(page.getByRole('heading', { name: 'Test Visitor' })).toBeVisible();

  await page.goto('/social-links');
  await expect(page.getByLabel('GitHub URL')).toHaveValue('https://github.com/PriyanshuDas0015');
  await expect(page.getByLabel('LinkedIn URL')).toHaveValue(
    'https://www.linkedin.com/in/priyanshu-das-63259b216',
  );
  await expect(page.getByLabel('Social Email')).toHaveValue('priyanshudassonu@gmail.com');
  await page.getByLabel('GitHub URL').fill('https://example.com/wrong-profile');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByText('Enter a GitHub profile URL')).toBeVisible();
  await page.getByLabel('GitHub URL').fill('https://github.com/PriyanshuDas0015');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByText('Settings updated')).toBeVisible();

  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test('mobile navigation drawer exposes every manager', async ({ page }) => {
  const session = await mockAdminApi(page);
  session.signIn();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('link', { name: /Projects/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Resume/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Messages/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Certificates/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Media Library/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Admin Account/ })).toBeVisible();
});
