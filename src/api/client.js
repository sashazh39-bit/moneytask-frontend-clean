const API_BASE = 'https://moneytask-backend.onrender.com';

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

// Функция создания/получения пользователя
export async function getOrCreateUser(telegramData) {
  try {
    // Попробуем получить
    return await apiGet(`/api/users/${telegramData.telegramId}`);
  } catch (err) {
    // Если не найден - создаем
    if (err.message.includes('не найден')) {
      return await apiPost('/api/users', {
        telegramId: telegramData.telegramId,
        username: telegramData.username,
        firstName: telegramData.firstName,
        lastName: telegramData.lastName,
      });
    }
    throw err;
  }
}
