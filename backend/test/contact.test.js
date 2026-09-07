import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
const payload = {
  name: 'Test Visitor',
  email: 'visitor@example.com',
  message: 'I would like to discuss a project.',
};
const services = (overrides) => ({
  databaseReady: () => false,
  emailReady: () => false,
  save: async () => ({ _id: 'test' }),
  send: async () => {},
  updateNotification: async () => {},
  ...overrides,
});

test('health responds and security headers are present', async () => {
  const response = await request(createApp()).get('/api/health');
  assert.deepEqual(response.body, { status: 'ok' });
  assert.equal(response.status, 200);
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
});
test('invalid fields return structured validation errors', async () => {
  const response = await request(createApp())
    .post('/api/contact')
    .send({ name: '', email: 'invalid', message: 'short' });
  assert.equal(response.status, 400);
  assert.deepEqual(Object.keys(response.body.errors).sort(), ['email', 'message', 'name']);
});
test('no configured destination never returns fake success', async () => {
  const response = await request(createApp({ services: services() }))
    .post('/api/contact')
    .send(payload);
  assert.equal(response.status, 503);
  assert.equal(response.body.success, false);
});
test('stored contact is sanitized and email notification is sent', async () => {
  let saved;
  let sent;
  let status;
  const app = createApp({
    services: services({
      databaseReady: () => true,
      emailReady: () => true,
      save: async (data) => {
        saved = data;
        return { _id: 'test' };
      },
      send: async (data) => {
        sent = data;
      },
      updateNotification: async (id, value) => {
        status = value;
      },
    }),
  });
  const response = await request(app)
    .post('/api/contact')
    .send({ ...payload, name: '<b>Test Visitor</b>' });
  assert.equal(response.status, 201);
  assert.equal(saved.name, 'Test Visitor');
  assert.equal(sent.email, payload.email);
  assert.equal(status, 'sent');
});
test('email-only configuration delivers without database', async () => {
  const response = await request(createApp({ services: services({ emailReady: () => true }) }))
    .post('/api/contact')
    .send(payload);
  assert.equal(response.status, 201);
});
test('stored message remains successful if notification fails', async () => {
  let status;
  const app = createApp({
    services: services({
      databaseReady: () => true,
      emailReady: () => true,
      send: async () => {
        throw Error('SMTP secret');
      },
      updateNotification: async (id, value) => {
        status = value;
      },
    }),
  });
  const response = await request(app).post('/api/contact').send(payload);
  assert.equal(response.status, 201);
  assert.equal(status, 'failed');
});
test('total delivery failure returns a safe error', async () => {
  const app = createApp({
    services: services({
      emailReady: () => true,
      send: async () => {
        throw Error('password123');
      },
    }),
  });
  const response = await request(app).post('/api/contact').send(payload);
  assert.equal(response.status, 503);
  assert.ok(!JSON.stringify(response.body).includes('password123'));
});
test('rate limits repeated submissions', async () => {
  const app = createApp({ services: services(), rateLimit: 2 });
  await request(app).post('/api/contact').send(payload);
  await request(app).post('/api/contact').send(payload);
  assert.equal((await request(app).post('/api/contact').send(payload)).status, 429);
});
test('rejects untrusted origins, huge bodies and invalid JSON', async () => {
  const app = createApp();
  assert.equal(
    (
      await request(app)
        .post('/api/contact')
        .set('Origin', 'https://untrusted.example')
        .send(payload)
    ).status,
    403,
  );
  assert.equal(
    (
      await request(app)
        .post('/api/contact')
        .send({ ...payload, message: 'x'.repeat(20000) })
    ).status,
    413,
  );
  assert.equal(
    (await request(app).post('/api/contact').set('Content-Type', 'application/json').send('{'))
      .status,
    400,
  );
});
