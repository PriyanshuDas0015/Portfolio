export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.too.large')
    return res.status(413).json({ success: false, message: 'Your message is too large.' });
  if (error.type === 'entity.parse.failed')
    return res.status(400).json({ success: false, message: 'Invalid request format.' });
  if (error.name === 'MulterError')
    return res.status(400).json({
      success: false,
      message:
        error.code === 'LIMIT_FILE_SIZE'
          ? 'The selected file is too large.'
          : 'The selected file type is not supported.',
    });
  if (error.name === 'ZodError') {
    const errors = {};
    for (const issue of error.issues) errors[issue.path.join('.') || 'form'] ??= issue.message;
    return res.status(400).json({ success: false, message: 'Please check the form.', errors });
  }
  if (error.code === 11000)
    return res
      .status(409)
      .json({ success: false, message: 'An item with that value already exists.' });
  if (error.name === 'CastError')
    return res.status(400).json({ success: false, message: 'Invalid item identifier.' });
  if (error.status)
    return res.status(error.status).json({ success: false, message: error.message });
  console.error('Request failed:', error.name || 'Error');
  return res
    .status(500)
    .json({ success: false, message: 'Your message could not be sent. Please try again later.' });
}
