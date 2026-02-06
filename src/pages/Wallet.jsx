import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api/client';

const MIN_AMOUNT = 100;

const METHODS = [
  { id: 'sbp', label: 'СБП' },
  { id: 'card', label: 'Карта' },
  { id: 'piastrix', label: 'Piastrix' },
  { id: 'fkwallet', label: 'FKWallet' },
  { id: 'usdt_trc20', label: 'USDT TRC20' },
  { id: 'ton', label: 'TON' },
];

export default function Wallet({ telegramId }) {
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
        apiGet(`/users/${telegramId}`),
        apiGet(`/withdrawals/user/${telegramId}`),
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
    load();
  }, []);

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
      const res = await apiPost('/withdrawals/request', {
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

  if (loading) return <div style={{ padding: 16 }}>Загрузка...</div>;

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      <h2>Кошелёк</h2>
      {user && (
        <div
          style={{
            marginTop: 8,
            padding: 16,
            borderRadius: 12,
            background: 'linear-gradient(135deg,#1f4037,#99f2c8)',
            color: '#000',
          }}
        >
          <div>Доступно для вывода</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            {user.balance} ₽
          </div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            Всего заработано: {user.totalEarned} ₽
          </div>
        </div>
      )}

      {/* Форма вывода */}
      <div style={{ marginTop: 24 }}>
        <h3>Вывести средства</h3>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 14 }}>Сумма (₽)</label>
            <input
              type="number"
              min={MIN_AMOUNT}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 8,
                border: '1px solid #444',
                marginTop: 4,
                background: '#000',
                color: '#fff',
              }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 14 }}>Способ вывода</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 8,
                border: '1px solid #444',
                marginTop: 4,
                background: '#000',
                color: '#fff',
              }}
            >
              {METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 14 }}>
              Реквизиты (номер карты / телефон СБП / кошелёк)
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              style={{
                width: '100%',
                padding: 8,
                borderRadius: 8,
                border: '1px solid #444',
                marginTop: 4,
                background: '#000',
                color: '#fff',
                resize: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 8,
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: 'none',
              background: '#1976d2',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {submitting ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>

      {/* История выводов */}
      <div style={{ marginTop: 24 }}>
        <h3>История выводов</h3>
        {history.length === 0 && <p style={{ fontSize: 14 }}>Пока нет заявок.</p>}
        {history.map((w) => (
          <div
            key={w._id}
            style={{
              padding: 8,
              borderRadius: 8,
              border: '1px solid #333',
              marginBottom: 8,
              fontSize: 13,
            }}
          >
            <div>
              {w.amount} ₽ • {w.method}
            </div>
            <div style={{ opacity: 0.8 }}>
              Статус: {w.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
