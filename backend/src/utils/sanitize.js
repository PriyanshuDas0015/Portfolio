// Store plain text. Notifications use text (never untrusted HTML).
export const sanitize = (value) =>
  value
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim();
