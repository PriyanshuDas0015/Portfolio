const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export async function sendContact(values) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success) {
      const error = new Error(
        result?.message || 'The server is unavailable. Please try again later.',
      );
      error.fields = result?.errors;
      throw error;
    }
    return result;
  } catch (error) {
    if (error.name === 'AbortError')
      throw new Error(
        'The request timed out. Delivery may still complete; please wait before trying again.',
      );
    if (error instanceof TypeError)
      throw new Error('Unable to connect. Please check your connection and try again.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
