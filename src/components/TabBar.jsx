import tabFont from '../assets/icons/tab-font.svg';
import tabHome from '../assets/icons/tab-home.svg';
import tabTasks from '../assets/icons/tab-tasks.svg';
import tabWallet from '../assets/icons/tab-wallet.svg';
import tabWithdrawals from '../assets/icons/tab-withdrawals.svg';
import tabInfo from '../assets/icons/tab-info.svg';

const tabs = [
  { id: 'home', label: 'Главная', icon: tabHome },
  { id: 'tasks', label: 'Задания', icon: tabTasks },
  { id: 'wallet', label: 'Кошелёк', icon: tabWallet },
  { id: 'withdrawals', label: 'Выплаты', icon: tabWithdrawals },
  { id: 'info', label: 'Инфо', icon: tabInfo },
];

export default function TabBar({ activeTab, onChange }) {
  const visibleTabs = tabs;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        left: 8,
        right: 8,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundImage: `url(${tabFont})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        zIndex: 50,
      }}
    >
      {visibleTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          aria-label={tab.label}
          style={{
            flex: 1,
            padding: 8,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={tab.icon}
            alt=""
            width={34}
            height={34}
            style={{ display: 'block' }}
          />
        </button>
      ))}
    </div>
  );
}
