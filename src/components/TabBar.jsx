import tabFont from '../assets/icons/tab-font.svg';
import tabHome from '../assets/icons/tab-home.svg';
import tabTasks from '../assets/icons/tab-tasks.svg';
import tabWallet from '../assets/icons/tab-wallet.svg';
import tabWithdrawals from '../assets/icons/tab-withdrawals.svg';
import tabInfo from '../assets/icons/tab-info.svg';
import edeniza from '../assets/icons/edeniza.svg';

const tabs = [
  { id: 'home', label: 'Главная', icon: tabHome },
  { id: 'tasks', label: 'Задания', icon: tabTasks },
  { id: 'wallet', label: 'Кошелёк', icon: tabWallet, activeIcon: edeniza },
  { id: 'withdrawals', label: 'Выплаты', icon: tabWithdrawals },
  { id: 'info', label: 'Инфо', icon: tabInfo },
];

export default function TabBar({ activeTab, onChange, isAdmin = false }) {
  const visibleTabs = isAdmin
    ? [...tabs, { id: 'admin', label: 'Админ', icon: tabHome }]
    : tabs;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundImage: `url(${tabFont})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        paddingBottom: 8,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        zIndex: 50,
      }}
    >
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconSrc = isActive && tab.activeIcon ? tab.activeIcon : tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              padding: '6px 4px',
              border: 'none',
              background: 'transparent',
              color: isActive ? '#fff' : '#9ca3af',
              fontSize: 11,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 44,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={iconSrc}
                alt=""
                width={tab.activeIcon && isActive ? 24 : 22}
                height={tab.activeIcon && isActive ? 24 : 22}
                style={{ display: 'block' }}
              />
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
