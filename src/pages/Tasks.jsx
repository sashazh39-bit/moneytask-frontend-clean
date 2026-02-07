// src/pages/Tasks.jsx
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api/client';

const REF_BASE = 'https://t.me/@moneytaskdemo_bot?start='; // замени на юзернейм бота

// порядок задач по ключам
const ORDER = [
  'tg_sub_1',
  'tg_sub_2',
  'story_repost',
  'ref_10',
  'ad_5',
  'ref_25',
];

export default function Tasks({ telegramId, userFromInit }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState(null);
  const [openedKey, setOpenedKey] = useState(null); // какая менюшка сейчас открыта

  const loadTasks = async () => {
    if (!telegramId) return;
    try {
      setLoading(true);
      const data = await apiGet(`/api/tasks/user/${telegramId}`);

      // сортируем по нашему ORDER, остальные в конец
      const withIndex = data.map((t) => ({
        ...t,
        _order: ORDER.indexOf(t.key),
      }));
      withIndex.sort((a, b) => {
        const ai = a._order === -1 ? 999 : a._order;
        const bi = b._order === -1 ? 999 : b._order;
        return ai - bi;
      });

      setTasks(withIndex);
    } catch (e) {
      alert('Ошибка загрузки заданий: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telegramId]);

  const handleComplete = async (task) => {
    if (task.completed) return;

    try {
      setBusyKey(task.key);
      const res = await apiPost(`/api/tasks/${task.key}/complete`, { telegramId });
      alert(res.message + ` Новый баланс: ${res.newBalance} ₽`);
      setOpenedKey(null);
      await loadTasks();
    } catch (e) {
      alert('Ошибка выполнения: ' + e.message);
    } finally {
      setBusyKey(null);
    }
  };

  const toggleOpen = (task) => {
    if (task.completed) return; // выполненные больше не открываем
    setOpenedKey((prev) => (prev === task.key ? null : task.key));
  };

  const getReferralLink = () => {
    // можно использовать telegramId или username
    const code = telegramId || userFromInit?.username || '';
    return `${REF_BASE}${code}`;
  };

  if (loading) {
    return <div style={{ padding: 16 }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      <h2>Задания</h2>

      {tasks.length === 0 && <p>Пока нет доступных заданий.</p>}

      {tasks.map((task) => {
        const isOpen = openedKey === task.key;
        const isBusy = busyKey === task.key;

        return (
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
            {/* верхняя строка: название + награда */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 15 }}>
                  {task.isSecret ? '⭐ ' : ''}
                  {task.title}
                </h3>
                {task.type === 'referral' && task.targetCount && (
                  <p
                    style={{
                      fontSize: 12,
                      opacity: 0.8,
                      margin: '4px 0 0',
                    }}
                  >
                    Цель: {task.targetCount} приглашённых
                  </p>
                )}
                {task.progress && task.type === 'referral' && (
                  <p
                    style={{
                      fontSize: 12,
                      opacity: 0.8,
                      margin: '2px 0 0',
                    }}
                  >
                    Прогресс: {task.progress.current}/{task.progress.target}
                  </p>
                )}
              </div>

              <span
                style={{
                  color: '#4caf50',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                +{task.reward} ₽
              </span>
            </div>

            {/* кнопка "Выполнить" / "Выполнено" */}
            <div style={{ marginTop: 8 }}>
              {task.completed ? (
                <button
                  disabled
                  style={{
                    width: '100%',
                    padding: 8,
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
                  onClick={() => toggleOpen(task)}
                  disabled={isBusy}
                  style={{
                    width: '100%',
                    padding: 8,
                    borderRadius: 8,
                    border: 'none',
                    background: isOpen ? '#0f172a' : '#1976d2',
                    color: '#fff',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {isBusy
                    ? 'Обработка...'
                    : isOpen
                    ? 'Скрыть детали'
                    : 'Выполнить'}
                </button>
              )}
            </div>

            {/* менюшка с деталями задания */}
            {isOpen && !task.completed && (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 10,
                  background: '#020617',
                  border: '1px solid #334155',
                  fontSize: 13,
                }}
              >
                {task.description && (
                  <p style={{ margin: '0 0 8px' }}>{task.description}</p>
                )}

                {/* подписки / репост / реклама – показываем ссылку */}
                {task.link && (
                  <a
                    href={task.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-block',
                      marginBottom: 10,
                      color: '#60a5fa',
                      textDecoration: 'underline',
                    }}
                  >
                    Открыть задание
                  </a>
                )}

                {/* блок для реферальных заданий */}
                {task.type === 'referral' && (
                  <div
                    style={{
                      marginTop: 4,
                      padding: 8,
                      borderRadius: 8,
                      background: '#0b1120',
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      Ваша реферальная ссылка
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        wordBreak: 'break-all',
                        marginBottom: 6,
                      }}
                    >
                      {getReferralLink()}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      Делитесь ссылкой с друзьями. Как только условия будут
                      выполнены, нажмите «Выполнил».
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleComplete(task)}
                  disabled={isBusy}
                  style={{
                    marginTop: 10,
                    width: '100%',
                    padding: 8,
                    borderRadius: 8,
                    border: 'none',
                    background: '#22c55e',
                    color: '#022c22',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {isBusy ? 'Проверяем...' : 'Выполнил'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
