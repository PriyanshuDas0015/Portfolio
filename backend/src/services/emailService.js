import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
export const emailConfigured = Boolean(env.smtpHost && env.smtpFrom && env.receiver);
const transport = emailConfigured
  ? nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: env.smtpUser ? { user: env.smtpUser, pass: env.smtpPass } : undefined,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    })
  : null;
export async function sendContactEmail(contact) {
  if (!transport) throw new Error('Email is not configured');
  const result = await transport.sendMail({
    from: env.smtpFrom,
    to: env.receiver,
    replyTo: contact.email,
    subject: `Portfolio message from ${contact.name}`,
    text: `Name: ${contact.name}\nEmail: ${contact.email}\n\n${contact.message}`,
  });
  if (!result.accepted?.length) throw new Error('Notification was not accepted');
}
