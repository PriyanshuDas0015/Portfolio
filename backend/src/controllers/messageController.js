import ContactMessage from '../models/ContactMessage.js';

export async function listMessages(req, res) {
  const query = {};
  if (req.query.status && ['unread', 'read', 'archived'].includes(req.query.status))
    query.status = req.query.status;
  if (req.query.search) {
    const search = { $regex: String(req.query.search).slice(0, 100), $options: 'i' };
    query.$or = [{ name: search }, { email: search }, { message: search }];
  }
  const items = await ContactMessage.find(query).sort({ createdAt: -1 }).lean();
  res.json({ success: true, items });
}
export async function markMessage(req, res) {
  const status = req.body.status || (req.body.isRead === false ? 'unread' : 'read');
  if (!['unread', 'read', 'archived'].includes(status))
    return res.status(400).json({ success: false, message: 'Choose a valid message status.' });
  const item = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: status !== 'unread', status },
    { new: true },
  );
  if (!item) return res.status(404).json({ success: false, message: 'Message not found.' });
  res.json({ success: true, item });
}
export async function archiveMessage(req, res) {
  req.body.status = 'archived';
  return markMessage(req, res);
}
export async function deleteMessage(req, res) {
  const item = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Message not found.' });
  res.json({ success: true });
}
