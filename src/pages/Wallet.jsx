import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api/client';

const MIN_AMOUNT = 500;
const MIN_AMOUNT_DISPLAY = '500 ₽';

const METHODS = [
  { id: 'sbp', label: 'СБП' },
  { id: 'card', label: 'По номеру карты' },
  { id: 'piastrix', label: 'Piastrix' },
  { id: 'usdt_trc20', label: 'USDT' },
  { id: 'fkwallet', label: 'FKwallet' },
  { id: 'ton', label: 'TON' },
];

const headerHeight = 56;
const tabBarHeight = 64;

export default function Wallet({ telegramId, onBack }) {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('sbp');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      const [u, h] = await Promise.all([
        apiGet(`/api/users/${telegramId}`),
        apiGet(`/api/withdrawals/user/${telegramId}`),
      ]);
      setUser(u);
      setHistory(h);
    } catch (e) {
      alert('Ошибка загрузки кошелька: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!telegramId) return;
    load();
  }, [telegramId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount < MIN_AMOUNT) {
      alert(`Минимальная сумма вывода: ${MIN_AMOUNT}₽`);
      return;
    }
    if (!details.trim()) {
      alert('Заполни реквизиты для вывода');
      return;
    }
    try {
      setSubmitting(true);
      const res = await apiPost('/api/withdrawals/request', {
        telegramId,
        amount: numericAmount,
        method,
        details: { value: details },
      });
      alert(res.message);
      setAmount('');
      setDetails('');
      await load();
    } catch (e) {
      alert('Ошибка создания заявки: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 16, paddingTop: headerHeight + 16 }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        color: '#fff',
        paddingBottom: tabBarHeight + 24,
      }}
    >
      {/* Шапка: кнопка назад | заголовок | меню */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: headerHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 12,
          paddingRight: 12,
          background: '#0f0f0f',
          zIndex: 100,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Назад"
          style={{
            width: 40,
            height: 36,
            borderRadius: 20,
            border: 'none',
            background: '#2a2a2a',
            color: '#60a5fa',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ←
        </button>
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          Кошелёк
        </h1>
        <button
          type="button"
          aria-label="Меню"
          style={{
            width: 40,
            height: 36,
            borderRadius: 20,
            border: 'none',
            background: '#2a2a2a',
            color: '#9ca3af',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ☰
        </button>
      </header>

      <div style={{ paddingTop: headerHeight + 16, paddingLeft: 16, paddingRight: 16 }}>
        {/* Карточка баланса */}
        <div
          style={{
            borderRadius: 16,
            padding: '16px 20px',
            background: '#1a1a1a',
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 14, color: '#e5e7eb', marginBottom: 4 }}>
            Доступно для вывода
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#60a5fa' }}>
            {user ? `${user.balance} ₽` : '0 ₽'}
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
            Минимальная сумма для вывода {MIN_AMOUNT_DISPLAY}
          </div>
        </div>

        {/* Шаг 1: Выберите способ вывода */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: '#2563eb',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            1
          </div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            Выберите способ вывода
          </h2>
        </div>

        {/* Сетка 2x3 способов вывода */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginBottom: 24,
          }}
        >
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 12px',
                borderRadius: 12,
                border: method === m.id ? '2px solid #2563eb' : '1px solid #2a2a2a',
                background: method === m.id ? '#1e3a5f' : '#1a1a1a',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 14,
              }}
            >
              <span>{m.label}</span>
              <span style={{ width: 32, height: 32, fontSize: 20, opacity: 0.9 }}>
                {m.id === 'sbp' && '◆'}
                {m.id === 'card' && '✓'}
                {m.id === 'piastrix' && '✶'}
                {m.id === 'usdt_trc20' && '₮'}
                {m.id === 'fkwallet' && 'FK'}
                {m.id === 'ton' && '◢'}
              </span>
            </button>
          ))}
        </div>

        {/* Форма: сумма и реквизиты */}
        <div
          style={{
            borderRadius: 16,
            padding: 16,
            background: '#1a1a1a',
            marginBottom: 20,
          }}
        >
          <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>Сумма и реквизиты</h3>
          <form onSubmit={onSubmit}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>
              Сумма (₽)
            </label>
            <input
              type="number"
              min={MIN_AMOUNT}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={MIN_AMOUNT_DISPLAY}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: 10,
                borderRadius: 10,
                border: '1px solid #334155',
                marginBottom: 12,
                background: '#0f0f0f',
                color: '#fff',
                fontSize: 15,
              }}
            />
            <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>
              Реквизиты (номер карты / СБП / кошелёк)
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Введите реквизиты"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: 10,
                borderRadius: 10,
                border: '1px solid #334155',
                marginBottom: 12,
                background: '#0f0f0f',
                color: '#fff',
                fontSize: 15,
                resize: 'none',
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 10,
                border: 'none',
                background: '#2563eb',
                color: '#fff',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              {submitting ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </form>
        </div>

        {/* История выводов */}
        <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>История выводов</h3>
        {history.length === 0 && (
          <p style={{ fontSize: 14, color: '#9ca3af' }}>Пока нет заявок.</p>
        )}
        {history.map((w) => (
          <div
            key={w._id}
            style={{
              padding: 12,
              borderRadius: 12,
              border: '1px solid #2a2a2a',
              marginBottom: 8,
              fontSize: 13,
              background: '#1a1a1a',
            }}
          >
            <div>{w.amount} ₽ • {w.method}</div>
            <div style={{ color: '#9ca3af', marginTop: 4 }}>Статус: {w.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
