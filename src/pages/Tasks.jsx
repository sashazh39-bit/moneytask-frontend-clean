// src/pages/Tasks.jsx
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api/client';

// ссылка для рефералов
const REF_BASE = 'https://t.me/moneytaskdemo_bot?start=';

// порядок отображения задач
const ORDER = [
  'tg_sub_1',
  'tg_sub_2',
  'story_repost',
  'ref_10',
  'ad_view',
  'ref_25',
];

export default function Tasks({ telegramId, userFromInit }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState(null);
  const [openedKey, setOpenedKey] = useState(null);

  // для заявки на репост
  const [storyScreenshotUrl, setStoryScreenshotUrl] = useState('');
  const [storySending, setStorySending] = useState(false);

  const loadTasks = async () => {
    if (!telegramId) return;
    try {
      setLoading(true);
      const data = await apiGet(`/api/tasks/user/${telegramId}`);

      // сортировка по ORDER
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

    // репост обрабатывается через заявку, а не прямой complete
    if (task.key === 'story_repost') {
      alert('Для этого задания отправь ссылку на репост.');
      return;
    }

    try {
      setBusyKey(task.key);
      const res = await apiPost(`/api/tasks/${task.key}/complete`, { telegramId });
      alert(res.message + ` Новый баланс: ${res.newBalance} ₽`);

      // Оптимистично помечаем одноразовые задания выполненными:
      // это защищает UI от случая, когда refresh списка временно не сработал.
      if (task.type !== 'referral' && task.type !== 'ad') {
        setTasks((prev) =>
          prev.map((t) =>
            t.key === task.key ? { ...t, completed: true } : t
          )
        );
      }

      setOpenedKey(null);
      await loadTasks();
    } catch (e) {
      alert('Ошибка выполнения: ' + e.message);
    } finally {
      setBusyKey(null);
    }
  };

  const toggleOpen = (task) => {
    if (task.completed) return;
    setOpenedKey((prev) => (prev === task.key ? null : task.key));
  };

  const getReferralLink = () => {
    const code = telegramId || userFromInit?.username || '';
    return `${REF_BASE}${code}`;
  };

  const submitStoryRequest = async () => {
    if (!storyScreenshotUrl.trim()) {
      alert('Укажи ссылку на репост');
      return;
    }
    try {
      setStorySending(true);
      const res = await apiPost('/api/story-repost/request', {
        telegramId,
        screenshotUrl: storyScreenshotUrl.trim(),
      });
      alert(res.message || 'Ссылка отправлена. Награда будет начислена в течение 24 часов.');
      setStoryScreenshotUrl('');
      setOpenedKey(null);
    } catch (e) {
      alert('Ошибка отправки заявки: ' + e.message);
    } finally {
      setStorySending(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 16 }}>Загрузка...</div>;
  }

  const openedTask =
    tasks.find((task) => task.key === openedKey && !task.completed) || null;
  const openedIsBusy = openedTask ? busyKey === openedTask.key : false;

  return (
    <div style={{ position: 'relative', padding: 16, paddingBottom: 80 }}>
      <div
        style={{
          filter: openedTask ? 'blur(6px)' : 'none',
          transition: 'filter 0.2s ease',
          pointerEvents: openedTask ? 'none' : 'auto',
        }}
      >
        <h2>Задания</h2>
        {tasks.length === 0 && <p>Пока нет доступных заданий.</p>}

        {tasks.map((task) => {
          const isOpen = openedTask?.key === task.key;
          const isBusy = busyKey === task.key;

          return (
            <div
              key={task.key}
              style={{
                borderRadius: 12,
                border: '1px solid #333',
                padding: 12,
                marginBottom: 12,
                background: '#13162a',
              }}
            >
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

                  {task.type === 'ad' && task.targetCount && (
                    <p
                      style={{
                        fontSize: 12,
                        opacity: 0.8,
                        margin: '4px 0 0',
                      }}
                    >
                      Можно посмотреть: {task.targetCount} раз, по {task.reward} ₽ за
                      просмотр
                    </p>
                  )}

                  {task.progress && (
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
                    {isBusy ? 'Обработка...' : isOpen ? 'Открыто' : 'Выполнить'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {openedTask && (
        <div
          onClick={() => setOpenedKey(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, 0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 520,
              maxHeight: '85vh',
              overflowY: 'auto',
              borderRadius: 16,
              background: '#0b1120',
              border: '1px solid #334155',
              padding: 14,
              boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 17 }}>
                {openedTask.isSecret ? '⭐ ' : ''}
                {openedTask.title}
              </h3>
              <button
                onClick={() => setOpenedKey(null)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  border: '1px solid #475569',
                  background: '#111827',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {openedTask.description && (
              <p style={{ margin: '10px 0 8px', fontSize: 13 }}>
                {openedTask.description}
              </p>
            )}

            {openedTask.link && (
              <a
                href={openedTask.link}
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

            {openedTask.key === 'story_repost' && (
              <div
                style={{
                  marginBottom: 8,
                  padding: 10,
                  borderRadius: 10,
                  background: '#020617',
                  border: '1px solid #334155',
                  fontSize: 12,
                  lineHeight: 1.4,
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  Как выполнить задание:
                </div>
                <ol style={{ paddingLeft: 16, margin: 0 }}>
                  <li>Открой пост на нашем канале (кнопка выше).</li>
                  <li>Сделай репост в историю Telegram.</li>
                  <li>Скопируй ссылку на свой репост.</li>
                  <li>Вставь ссылку ниже и отправь.</li>
                </ol>
                <p style={{ marginTop: 8, marginBottom: 0 }}>
                  Награда будет начислена в течение 24 часов.
                </p>

                <div style={{ marginTop: 8 }}>
                  <label style={{ fontSize: 12 }}>Ссылка на репост *</label>
                  <input
                    type="text"
                    value={storyScreenshotUrl}
                    onChange={(e) => setStoryScreenshotUrl(e.target.value)}
                    placeholder="https://t.me/..."
                    style={{
                      width: '100%',
                      marginTop: 4,
                      padding: 8,
                      borderRadius: 8,
                      border: '1px solid #334155',
                      background: '#020617',
                      color: '#e5e7eb',
                      fontSize: 12,
                    }}
                  />
                </div>

                <button
                  onClick={submitStoryRequest}
                  disabled={storySending}
                  style={{
                    marginTop: 10,
                    width: '100%',
                    padding: 9,
                    borderRadius: 8,
                    border: 'none',
                    background: '#22c55e',
                    color: '#022c22',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {storySending ? 'Отправляем...' : 'Отправить ссылку'}
                </button>
              </div>
            )}

            {openedTask.type === 'referral' && (
              <div
                style={{
                  marginTop: 4,
                  marginBottom: 8,
                  padding: 10,
                  borderRadius: 10,
                  background: '#020617',
                  border: '1px solid #334155',
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
                  Делитесь ссылкой с друзьями. Как только условия будут выполнены,
                  нажмите «Выполнил».
                </div>
              </div>
            )}

            {openedTask.type === 'ad' && (
              <p style={{ margin: '0 0 8px', fontSize: 12 }}>
                Нажимай «Выполнил» после каждого просмотра рекламного ролика.
                Максимум {openedTask.targetCount} просмотров, по {openedTask.reward} ₽
                за каждый.
              </p>
            )}

            {openedTask.key !== 'story_repost' && (
              <button
                onClick={() => handleComplete(openedTask)}
                disabled={openedIsBusy}
                style={{
                  marginTop: 10,
                  width: '100%',
                  padding: 9,
                  borderRadius: 8,
                  border: 'none',
                  background: '#22c55e',
                  color: '#022c22',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {openedIsBusy ? 'Проверяем...' : 'Выполнил'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
