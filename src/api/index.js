const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const body = await res.json();
      if (body.errors) message = Object.values(body.errors).flat().join(', ');
      else if (body.error) message = body.error;
    } catch (_) {}
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}
