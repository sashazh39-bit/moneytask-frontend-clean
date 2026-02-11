import tabFont from '../assets/icons/tab-font.svg';
import tabHome from '../assets/icons/tab-home.svg';
import tabTasks from '../assets/icons/tab-tasks.svg';
import tabWallet from '../assets/icons/tab-wallet.svg';
import tabWithdrawals from '../assets/icons/tab-withdrawals.svg';
import tabInfo from '../assets/icons/tab-info.svg';
import { useEffect, useMemo, useState } from 'react';

const tabs = [
  { id: 'home', label: 'Главная', icon: tabHome },
  { id: 'tasks', label: 'Задания', icon: tabTasks },
  { id: 'wallet', label: 'Кошелёк', icon: tabWallet },
  { id: 'withdrawals', label: 'Выплаты', icon: tabWithdrawals },
  { id: 'info', label: 'Инфо', icon: tabInfo },
];

const BASE_WIDTH = 320;
// Горизонтальный сдвиг всей группы таб-бара (в px для макета 320x568)
const SHIFT_TABBAR_X_PX = -1;

export default function TabBar({ activeTab, onChange }) {
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : BASE_WIDTH
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scale = useMemo(() => {
    const clamped = Math.min(viewportWidth, 430);
    return clamped / BASE_WIDTH;
  }, [viewportWidth]);
  const px = (value) => value * scale;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: px(5),
        left: '50%',
        transform: `translateX(calc(-50% + ${px(SHIFT_TABBAR_X_PX)}px))`,
        width: px(320),
        height: px(70),
        zIndex: 120,
      }}
    >
      <img
        src={tabFont}
        alt=""
        style={{
          position: 'absolute',
          top: px(0),
          left: px(4),
          width: px(312),
          height: px(60),
          display: 'block',
          pointerEvents: 'none',
        }}
      />

      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          aria-label={tab.label}
          style={{
            position: 'absolute',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            top:
              tab.id === 'wallet'
                ? px(8)
                : px(20),
            left:
              tab.id === 'home'
                ? px(24)
                : tab.id === 'tasks'
                ? px(88)
                : tab.id === 'wallet'
                ? px(139)
                : tab.id === 'withdrawals'
                ? px(208)
                : px(265),
            width:
              tab.id === 'wallet'
                ? px(42)
                : tab.id === 'info'
                ? px(24)
                : px(18),
            height: tab.id === 'info' ? px(18) : tab.id === 'wallet' ? px(42) : px(18),
          }}
        >
          <img
            src={tab.icon}
            alt=""
            width="100%"
            height="100%"
            style={{
              display: 'block',
              opacity: activeTab === tab.id ? 1 : 0.95,
            }}
          />
        </button>
      ))}
    </div>
  );
}
