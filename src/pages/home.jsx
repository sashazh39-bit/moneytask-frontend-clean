import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

export default function Home({ telegramId }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [u, s] = await Promise.all([
        apiGet(`/users/${telegramId}`),
        apiGet('/statistics/global'),
      ]);
      setUser(u);
      setStats(s);
    } catch (e) {
      alert('Ошибка загрузки главной: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Загрузка...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>MoneyTask</h1>
      {user && (
        <p style={{ marginTop: 0 }}>
          Привет, <strong>{user.firstName || user.username || user.telegramId}</strong>!
        </p>
      )}

      {user && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            background: 'linear-gradient(135deg,#1e3c72,#2a5298)',
          }}
        >
          <div>Балааанс</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {user.balance} ₽
          </div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            Всего заработано: {user.totalEarned} ₽
          </div>
        </div>
      )}

      {stats && (
        <div style={{ marginTop: 24 }}>
          <h3>Статистика проекта</h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: 14 }}>
            <li>🟢 Онлайн: {stats.onlineUsers}</li>
            <li>📅 Работаем: {stats.daysOnline} дней</li>
            <li>👥 Пользователей: {stats.totalUsers}</li>
            <li>💸 Выплат: {stats.totalWithdrawals}</li>
            <li>💰 Выплачено всего: {stats.totalPaidOut} ₽</li>
            <li>⏱ Среднее время выплаты: ~{stats.averageProcessingMinutes} мин</li>
          </ul>
        </div>
      )}
    </div>
  );
}
