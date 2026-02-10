import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut } from '../api/client';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString();
}

export default function Admin({ telegramId, isAdmin }) {
  const [repostRequests, setRepostRequests] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [grantId, setGrantId] = useState('');
  const [granting, setGranting] = useState(false);

  const load = async () => {
    if (!telegramId || !isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [reposts, withdrawals] = await Promise.all([
        apiGet('/api/admin/story-repost/requests?status=pending', { telegramId }),
        apiGet('/api/admin/withdrawals/requests?status=pending,processing', {
          telegramId,
        }),
      ]);
      setRepostRequests(reposts);
      setWithdrawalRequests(withdrawals);
    } catch (e) {
      alert('Ошибка загрузки админ-данных: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [telegramId, isAdmin]);

  const handleRepostDecision = async (requestId, status) => {
    try {
      setBusyId(requestId);
      const payload = { status };
      if (status === 'rejected') {
        const reason = window.prompt('Причина отклонения (необязательно):', '');
        payload.rejectReason = reason || undefined;
      }
      const res = await apiPut(
        `/api/admin/story-repost/${requestId}/status`,
        payload,
        { telegramId }
      );
      alert(res.message || 'Статус обновлён');
      await load();
    } catch (e) {
      alert('Ошибка модерации репоста: ' + e.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleWithdrawalDecision = async (withdrawalId, status) => {
    try {
      setBusyId(withdrawalId);
      const payload = { status };
      if (status === 'rejected') {
        const reason = window.prompt('Причина отклонения (необязательно):', '');
        payload.rejectReason = reason || undefined;
      }
      const res = await apiPut(
        `/api/admin/withdrawals/${withdrawalId}/status`,
        payload,
        { telegramId }
      );
      alert(res.message || 'Статус заявки обновлён');
      await load();
    } catch (e) {
      alert('Ошибка обновления вывода: ' + e.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleGrantAdmin = async () => {
    const targetTelegramId = Number(grantId);
    if (!targetTelegramId) {
      alert('Укажи корректный telegramId');
      return;
    }

    try {
      setGranting(true);
      const res = await apiPost(
        '/api/admin/grant',
        {
          targetTelegramId,
          role: 'admin',
        },
        { telegramId }
      );
      alert(res.message || 'Права администратора выданы');
      setGrantId('');
    } catch (e) {
      alert('Ошибка выдачи прав: ' + e.message);
    } finally {
      setGranting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: 16, paddingBottom: 80 }}>
        <h2>Админка</h2>
        <p>Доступ только для администраторов.</p>
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: 16 }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      <h2>Админ-панель</h2>

      <div
        style={{
          marginTop: 12,
          border: '1px solid #334155',
          borderRadius: 10,
          padding: 10,
          background: '#0b1120',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Назначить администратора</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            placeholder="telegramId пользователя"
            value={grantId}
            onChange={(e) => setGrantId(e.target.value)}
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 8,
              border: '1px solid #334155',
              background: '#020617',
              color: '#e5e7eb',
            }}
          />
          <button
            onClick={handleGrantAdmin}
            disabled={granting}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: 'none',
              background: '#22c55e',
              color: '#022c22',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {granting ? 'Назначаем...' : 'Назначить'}
          </button>
        </div>
        <p style={{ opacity: 0.7, fontSize: 12, marginBottom: 0 }}>
          Эта операция доступна только `SUPER_ADMIN_TELEGRAM_ID`.
        </p>
      </div>

      <h3 style={{ marginTop: 20 }}>Заявки на репост</h3>
      {repostRequests.length === 0 && <p>Нет новых заявок.</p>}
      {repostRequests.map((r) => (
        <div
          key={r._id}
          style={{
            border: '1px solid #334155',
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            background: '#020617',
          }}
        >
          <div style={{ fontSize: 13 }}>
            Пользователь: {r.userTelegramId} • {formatDate(r.createdAt)}
          </div>
          <a
            href={r.screenshotUrl}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#60a5fa', fontSize: 13 }}
          >
            Ссылка на репост
          </a>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              onClick={() => handleRepostDecision(r._id, 'approved')}
              disabled={busyId === r._id}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: 'none',
                background: '#22c55e',
                color: '#022c22',
                fontWeight: 600,
              }}
            >
              Одобрить
            </button>
            <button
              onClick={() => handleRepostDecision(r._id, 'rejected')}
              disabled={busyId === r._id}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: 'none',
                background: '#ef4444',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Отклонить
            </button>
          </div>
        </div>
      ))}

      <h3 style={{ marginTop: 20 }}>Заявки на вывод</h3>
      {withdrawalRequests.length === 0 && <p>Нет заявок.</p>}
      {withdrawalRequests.map((w) => (
        <div
          key={w._id}
          style={{
            border: '1px solid #334155',
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            background: '#020617',
          }}
        >
          <div style={{ fontSize: 13 }}>
            Пользователь: {w.userTelegramId} • {w.amount} ₽ • {w.method}
          </div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            Статус: {w.status} • {formatDate(w.createdAt)}
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
            Реквизиты: {w.details?.value || '-'}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              onClick={() => handleWithdrawalDecision(w._id, 'processing')}
              disabled={busyId === w._id}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: 'none',
                background: '#f59e0b',
                color: '#111827',
                fontWeight: 600,
              }}
            >
              В обработку
            </button>
            <button
              onClick={() => handleWithdrawalDecision(w._id, 'completed')}
              disabled={busyId === w._id}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: 'none',
                background: '#22c55e',
                color: '#022c22',
                fontWeight: 600,
              }}
            >
              Подтвердить
            </button>
            <button
              onClick={() => handleWithdrawalDecision(w._id, 'rejected')}
              disabled={busyId === w._id}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: 'none',
                background: '#ef4444',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Отклонить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
