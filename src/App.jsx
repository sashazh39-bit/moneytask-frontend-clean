// src/App.jsx
import { useState, useEffect } from 'react';
import Home from './pages/home';
import Tasks from './pages/Tasks';
import Wallet from './pages/Wallet';
import Withdrawals from './pages/Withdrawals';
import Info from './pages/Info';
import TabBar from './components/TabBar';
import { useTelegramUser } from './hooks/useTelegramUser';

console.log('VERSION 2.0 LOADED');
console.log('TG in App:', window.Telegram?.WebApp);
console.log('InitData in App:', window.Telegram?.WebApp?.initData);
console.log('InitDataUnsafe in App:', window.Telegram?.WebApp?.initDataUnsafe);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { user, telegramId } = useTelegramUser();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand?.();
    }
  }, []);

  const screenProps = {
    telegramId,
    userFromInit: user,
  };

  const screens = {
    home: <Home {...screenProps} />,
    tasks: <Tasks {...screenProps} />,
    wallet: <Wallet {...screenProps} />,
    withdrawals: <Withdrawals {...screenProps} />,
    info: <Info {...screenProps} />,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingBottom: 56,
        background: '#000',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {screens[activeTab]}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;
