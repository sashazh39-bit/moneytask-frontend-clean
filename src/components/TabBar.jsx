const tabs = [
  { id: 'home', label: 'Главная', icon: '🏠' },
  { id: 'tasks', label: 'Задания', icon: '✅' },
  { id: 'wallet', label: 'Кошелёк', icon: '💰' },
  { id: 'withdrawals', label: 'Выплаты', icon: '💸' },
  { id: 'info', label: 'Инфо', icon: 'ℹ️' },
];

export default function TabBar({ activeTab, onChange }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        borderTop: '1px solid #333',
        background: '#111',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            padding: '8px 4px',
            border: 'none',
            background: activeTab === tab.id ? '#222' : '#111',
            color: activeTab === tab.id ? '#fff' : '#aaa',
            fontSize: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 18 }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
