import mongoose from 'mongoose';
import ContactMessage from '../models/ContactMessage.js';
import { emailConfigured, sendContactEmail } from '../services/emailService.js';

export const contactServices = {
  databaseReady: () => mongoose.connection.readyState === 1,
  emailReady: () => emailConfigured,
  save: (contact) => ContactMessage.create(contact),
  send: sendContactEmail,
  updateNotification: (id, status) =>
    ContactMessage.findByIdAndUpdate(id, { notificationStatus: status }),
};

export function createContactController(services = contactServices) {
  return async (req, res) => {
    const databaseReady = services.databaseReady();
    const emailReady = services.emailReady();
    if (!databaseReady && !emailReady)
      return res.status(503).json({
        success: false,
        message:
          'The contact form is temporarily unavailable. Please connect with me on GitHub or try again later.',
      });
    let saved;
    let emailed = false;
    if (databaseReady) {
      try {
        saved = await services.save({
          ...req.contact,
          notificationStatus: emailReady ? 'pending' : 'not-configured',
        });
      } catch {
        console.error('Contact storage unavailable.');
      }
    }
    if (emailReady) {
      try {
        await services.send(req.contact);
        emailed = true;
      } catch {
        console.error('Contact notification could not be delivered.');
      }
      if (saved) {
        try {
          await services.updateNotification(saved._id, emailed ? 'sent' : 'failed');
        } catch {
          console.error('Notification status could not be updated.');
        }
      }
    }
    if (!saved && !emailed)
      return res.status(503).json({
        success: false,
        message: 'Your message could not be sent. Please try again later.',
      });
    return res.status(201).json({ success: true, message: 'Message sent successfully.' });
  };
}
