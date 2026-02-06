import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString();
}

export default function Withdrawals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await apiGet('/withdrawals/recent?limit=50');
      setItems(data);
    } catch (e) {
      // ВРЕМЕННО без alert, чтобы не мешал
      alert('Ошибка загрузки выплат: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 10000); // обновление каждые 10с
    return () => clearInterval(id);
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Загрузка...</div>;

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      <h2>Выплаты</h2>
      {items.length === 0 && <p style={{ fontSize: 14 }}>Пока нет завершённых выплат.</p>}
      {items.map((w) => (
        <div
          key={w._id}
          style={{
            borderRadius: 8,
            border: '1px solid #333',
            padding: 8,
            marginBottom: 8,
            fontSize: 13,
          }}
        >
          <div>
            Пользователь {w.userTelegramId} вывел {w.amount} ₽ через {w.method}
          </div>
          <div style={{ opacity: 0.7 }}>
            {w.processedAt ? formatTime(w.processedAt) : formatTime(w.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
}
