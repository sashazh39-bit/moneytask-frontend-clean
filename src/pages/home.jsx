import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

export default function Home({ telegramId }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // текст ошибки вместо alert

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      // если телеграм-айди не пришел, сразу показываем сообщение
      if (!telegramId) {
        setError('Не удалось получить данные Telegram. Попробуйте перезапустить мини‑приложение.');
        setLoading(false);
        return;
      }

      const [u, s] = await Promise.all([
        apiGet(`/api/users/${telegramId}`),
        apiGet('/api/statistics/global'),
      ]);

      setUser(u);
      setStats(s);
    } catch (e) {
      console.error(e);
      setError('Не удалось загрузить данные. Проверьте подключение к интернету и попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 16,
        background: 'radial-gradient(circle at top, #1f2933 0, #050608 60%)',
        color: '#f9fafb',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Шапка */}
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>MoneyTask777</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.8 }}>
          Мини‑приложение для заработка денег на заданиях
        </p>
      </header>

      {/* Приветствие / загрузка / ошибка */}
      {loading && (
        <div style={{ marginTop: 24, fontSize: 14, opacity: 0.9 }}>
          Загрузка данных...
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            background: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.6)',
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && user && (
        <p style={{ marginTop: 12, fontSize: 14 }}>
          Привет,{' '}
          <span style={{ fontWeight: 600 }}>
            {user.firstName || user.username || user.telegramId}
          </span>
          !
        </p>
      )}

      {/* Карточка баланса */}
      {user && !error && (
        <section
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 16,
            background: 'linear-gradient(135deg,#0f172a,#1d4ed8)',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.8)',
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.85 }}>Текущий баланс</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>
            {user.balance} ₽
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
            Всего заработано: {user.totalEarned} ₽
          </div>

          <button
            style={{
              marginTop: 12,
              width: '100%',
              padding: '10px 0',
              borderRadius: 999,
              border: 'none',
              background: '#22c55e',
              color: '#020617',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Перейти к заданиям
          </button>
        </section>
      )}

      {/* Статистика проекта */}
      {stats && !error && (
        <section
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 16,
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
          }}
        >
          <h3 style={{ margin: 0, fontSize: 15, marginBottom: 8 }}>
            Статистика проекта
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13 }}>
            <li style={{ marginTop: 4 }}>🟢 Онлайн: {stats.onlineUsers}</li>
            <li style={{ marginTop: 4 }}>📅 Работаем: {stats.daysOnline} дней</li>
            <li style={{ marginTop: 4 }}>👥 Пользователей: {stats.totalUsers}</li>
            <li style={{ marginTop: 4 }}>💸 Выплат: {stats.totalWithdrawals}</li>
            <li style={{ marginTop: 4 }}>💰 Выплачено всего: {stats.totalPaidOut} ₽</li>
            <li style={{ marginTop: 4 }}>
              ⏱ Среднее время выплаты: ~{stats.averageProcessingMinutes} мин
            </li>
          </ul>
        </section>
      )}

      {/* Кнопка перезагрузки при ошибке */}
      {!loading && error && (
        <button
          style={{
            marginTop: 16,
            width: '100%',
            padding: '10px 0',
            borderRadius: 999,
            border: '1px solid rgba(148, 163, 184, 0.5)',
            background: 'transparent',
            color: '#e5e7eb',
            fontSize: 14,
            cursor: 'pointer',
          }}
          onClick={load}
        >
          Попробовать ещё раз
        </button>
      )}
    </div>
  );
}
