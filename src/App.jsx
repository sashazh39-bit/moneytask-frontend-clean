//app.jsx
import { useState, useEffect } from 'react';
import Home from './pages/home';
import Tasks from './pages/Tasks';
import Wallet from './pages/Wallet';
import Withdrawals from './pages/Withdrawals';
import Info from './pages/Info';
import Admin from './pages/Admin';
import TabBar from './components/TabBar';
import { useTelegramUser } from './hooks/useTelegramUser';
import { apiGet, apiPost } from './api/client';

console.log('VERSION 2.0 LOADED');
console.log('TG in App:', window.Telegram?.WebApp);
console.log('InitData in App:', window.Telegram?.WebApp?.initData);
console.log('InitDataUnsafe in App:', window.Telegram?.WebApp?.initDataUnsafe);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { user, telegramId } = useTelegramUser();
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    const ensureUser = async () => {
      if (!telegramId) return;

      try {
        const existing = await apiGet(`/api/users/${telegramId}`);
        setDbUser(existing);
        return;
      } catch (e) {
        if (!e.message?.includes('не найден')) {
          console.error('Ошибка загрузки пользователя в App:', e);
          return;
        }
      }

      try {
        const created = await apiPost('/api/users/register', {
          telegramId,
          username: user?.username || '',
          firstName: user?.firstName || user?.first_name || '',
          lastName: user?.lastName || user?.last_name || '',
        });
        setDbUser(created);
      } catch (e) {
        console.error('Ошибка регистрации пользователя в App:', e);
      }
    };

    ensureUser();
  }, [telegramId, user]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand?.();
      tg.setBackgroundColor?.('#000000');
      tg.enableClosingConfirmation?.();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'admin' && dbUser?.role !== 'admin') {
      setActiveTab('home');
    }
  }, [activeTab, dbUser]);

  const screenProps = {
    telegramId,
    userFromInit: user,
    isAdmin: dbUser?.role === 'admin',
  };

  const screens = {
    home: <Home {...screenProps} />,
    tasks: <Tasks {...screenProps} />,
    wallet: <Wallet {...screenProps} onBack={() => setActiveTab('home')} />,
    withdrawals: <Withdrawals {...screenProps} />,
    info: <Info {...screenProps} />,
    admin: <Admin {...screenProps} />,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingBottom: 72,
        background: '#000',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {screens[activeTab]}
      <TabBar
        activeTab={activeTab}
        onChange={setActiveTab}
        isAdmin={dbUser?.role === 'admin'}
      />
    </div>
  );
}

export default App;
