import { useEffect, useState } from 'react';

export function useTelegramUser() {
  const [user, setUser] = useState({ id: 1, first_name: 'Local' });
  const [telegramId, setTelegramId] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Временная заглушка: ничего не делаем
  }, []);

  return { user, telegramId, loading };
}
