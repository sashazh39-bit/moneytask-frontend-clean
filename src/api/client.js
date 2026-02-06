const API_BASE = 'https://moneytask-backend.onrender.com';

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `GET ${path} failed`);
  }
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) {
    let msg = `POST ${path} failed`;
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch (_) {}
    throw new Error(msg);
  }
  return res.json();
}
