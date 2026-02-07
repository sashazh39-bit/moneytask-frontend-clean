// src/hooks/useTelegramUser.js
import { useEffect, useState } from 'react';

export function useTelegramUser() {
  const [user, setUser] = useState(null);
  const [telegramId, setTelegramId] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    // если открыто как Telegram WebApp
    if (tg?.initDataUnsafe?.user) {
      const u = tg.initDataUnsafe.user;

      setUser({
        telegramId: u.id,
        username: u.username || '',
        firstName: u.first_name || '',
        lastName: u.last_name || '',
      });
      setTelegramId(u.id);
    } else {
      // режим разработки в браузере
      console.warn('Telegram WebApp user not found, using test id');
      setUser({
        telegramId: 123456789,
        username: 'test_user',
        firstName: 'Test',
        lastName: 'User',
      });
      setTelegramId(123456789);
    }
  }, []);

  return { user, telegramId };
}
