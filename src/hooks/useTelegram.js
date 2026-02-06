import { useEffect, useState } from 'react';

// В useTelegram.js для разработки
export function useTelegram() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    
    if (telegram?.initDataUnsafe?.user) {
      // Реальный Telegram
      setUser({
        telegramId: telegram.initDataUnsafe.user.id,
        username: telegram.initDataUnsafe.user.username,
        // ...
      });
    } else {
      // Для тестирования в браузере
      console.warn('🔧 Тестовый режим - используется фейковый ID');
      setUser({
        telegramId: 123456789,
        username: 'test_user',
        firstName: 'Test',
        lastName: 'User',
      });
    }
  }, []);

  return { user };
}
