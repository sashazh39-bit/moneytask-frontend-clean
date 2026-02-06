import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api/client';

export default function Tasks({ telegramId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await apiGet(`/tasks/user/${telegramId}`);
      setTasks(data);
    } catch (e) {
      alert('Ошибка загрузки заданий: ' + e.message);
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
      const res = await apiPost(`/tasks/${key}/complete`, { telegramId });
      alert(res.message + ` Новый баланс: ${res.newBalance} ₽`);
      await loadTasks();
    } catch (e) {
      // ВРЕМЕННО без alert, чтобы не мешал
      alert('Ошибка выполнения: ' + e.message);
    } finally {
      setBusyKey(null);
    }
  };

  if (loading) return <div style={{ padding: 16 }}>Загрузка...</div>;

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
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
