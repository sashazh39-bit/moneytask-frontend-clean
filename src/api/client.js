// src/api/client.js

const API_BASE = 'https://moneytask-backend.onrender.com';

// GET запрос
export async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Request failed');
  }
  
  return res.json();
}

// POST запрос
export async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

// PUT запрос (для обновлений)
export async function apiPut(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

// Получить или создать пользователя
export async function getOrCreateUser(telegramData) {
  try {
    // Попытка получить существующего
    return await apiGet(`/api/users/${telegramData.telegramId}`);
  } catch (err) {
    // Если не найден - создаём
    if (err.message.includes('не найден') || err.message.includes('not found')) {
      return await apiPost('/api/users', {
        telegramId: telegramData.telegramId,
        username: telegramData.username || '',
        firstName: telegramData.firstName || '',
        lastName: telegramData.lastName || '',
      });
    }
    throw err;
  }
}
