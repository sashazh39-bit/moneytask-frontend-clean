const tabs = [
  { id: 'home', label: 'Главная', icon: '🛡️' },
  { id: 'tasks', label: 'Задания', icon: '☰' },
  { id: 'wallet', label: 'Кошелёк', icon: '💰' },
  { id: 'withdrawals', label: 'Выплаты', icon: '📊' },
  { id: 'info', label: 'Инфо', icon: '📷' },
];

export default function TabBar({ activeTab, onChange, isAdmin = false }) {
  const visibleTabs = isAdmin
    ? [...tabs, { id: 'admin', label: 'Админ', icon: '🛡️' }]
    : tabs;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        background: '#1a1a1a',
        paddingBottom: 8,
        zIndex: 50,
      }}
    >
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab.id;
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
                borderRadius: 10,
                background: isActive ? '#2563eb' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
