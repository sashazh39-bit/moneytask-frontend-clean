// src/api/client.js

const API_BASE = 'https://moneytask-backend.onrender.com';

function withTelegramHeader(headers = {}, telegramId) {
  if (!telegramId) return headers;
  return { ...headers, 'X-Telegram-Id': String(telegramId) };
}

// GET запрос
export async function apiGet(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: withTelegramHeader({}, options.telegramId),
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Request failed');
  }
  
  return res.json();
}

// POST запрос
export async function apiPost(path, body, options = {}) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: withTelegramHeader(
      { 'Content-Type': 'application/json' },
      options.telegramId
    ),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

// PUT запрос (для обновлений)
export async function apiPut(path, body, options = {}) {
  const res = await fetch(API_BASE + path, {
    method: 'PUT',
    headers: withTelegramHeader(
      { 'Content-Type': 'application/json' },
      options.telegramId
    ),
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
