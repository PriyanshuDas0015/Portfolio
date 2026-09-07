export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.too.large')
    return res.status(413).json({ success: false, message: 'Your message is too large.' });
  if (error.type === 'entity.parse.failed')
    return res.status(400).json({ success: false, message: 'Invalid request format.' });
  console.error('Request failed:', error.name || 'Error');
  return res
    .status(500)
    .json({ success: false, message: 'Your message could not be sent. Please try again later.' });
}
