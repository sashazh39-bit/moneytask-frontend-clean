import { useEffect, useState } from 'react';

export default function Tasks({ telegramId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);

      // ВРЕМЕННАЯ ЗАГЛУШКА — НЕТ запросов на backend
      // Фейковый список заданий
      const mockTasks = [
        {
          key: 'subscribe_telegram',
          title: 'Подписаться на Telegram-канал',
          description: 'Подпишитесь на наш канал и получите вознаграждение',
          reward: 50,
          type: 'link',
          link: 'https://t.me/yourchannel',
          completed: false,
          isSecret: false,
        },
        {
          key: 'invite_3_friends',
          title: 'Пригласить 3 друзей',
          description: 'Пригласите минимум 3 друзей в бот',
          reward: 100,
          type: 'referral',
          targetCount: 3,
          progress: { current: 0, target: 3 },
          completed: false,
          isSecret: false,
        },
        {
          key: 'secret_bonus',
          title: 'Секретное задание',
          description: 'Выполните секретное задание для получения бонуса',
          reward: 200,
          type: 'secret',
          completed: false,
          isSecret: true,
        },
      ];

      setTasks(mockTasks);
    } catch (e) {
      console.error('Ошибка загрузки заданий:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleComplete = async (key) => {
    try {
      setBusyKey(key);

      // ВРЕМЕННАЯ ЗАГЛУШКА — симуляция выполнения
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Найти задание и отметить как выполненное
      setTasks((prev) =>
        prev.map((t) =>
          t.key === key ? { ...t, completed: true } : t
        )
      );

      alert('Задание выполнено! +' + tasks.find((t) => t.key === key)?.reward + ' ₽');
    } catch (e) {
      console.error('Ошибка выполнения задания:', e);
      alert('Не удалось выполнить задание');
    } finally {
      setBusyKey(null);
    }
  };

  if (loading)
    return <div style={{ padding: 16, color: '#fff' }}>Загрузка...</div>;

  return (
    <div style={{ padding: 16, paddingBottom: 80, color: '#fff' }}>
      <h2>Задания</h2>
      {tasks.length === 0 && <p>Пока нет доступных заданий.</p>}

      {tasks.map((task) => (
        <div
          key={task.key}
          style={{
            borderRadius: 12,
            border: '1px solid #333',
            padding: 12,
            marginBottom: 12,
            background: '#111',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>
              {task.isSecret ? '⭐ ' : ''}
              {task.title}
            </h3>
            <span style={{ color: '#4caf50', fontWeight: 600 }}>
              +{task.reward} ₽
            </span>
          </div>

          {task.description && (
            <p style={{ marginTop: 8, fontSize: 14 }}>{task.description}</p>
          )}

          {task.type === 'referral' && task.targetCount && (
            <p style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
              Цель: {task.targetCount} приглашённых
            </p>
          )}

          {task.progress && task.type === 'referral' && (
            <p style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
              Прогресс: {task.progress.current}/{task.progress.target}
            </p>
          )}

          {task.link && (
            <a
              href={task.link}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 13, color: '#61dafb' }}
            >
              Открыть задание
            </a>
          )}

          <div style={{ marginTop: 8 }}>
            {task.completed ? (
              <button
                disabled
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#2e7d32',
                  color: '#fff',
                  fontSize: 13,
                }}
              >
                ✅ Выполнено
              </button>
            ) : (
              <button
                onClick={() => handleComplete(task.key)}
                disabled={busyKey === task.key}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#1976d2',
                  color: '#fff',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {busyKey === task.key ? 'Обработка...' : 'Выполнить'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
