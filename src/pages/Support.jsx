export default function Support() {
  const supportBot = 'https://t.me/moneytaskdemo_bot';
  const supportChat = 'https://t.me/moneytask_support';
  const channelUrl = 'https://t.me/moneytask_channel';

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      <h2>Техническая поддержка</h2>
      <p style={{ opacity: 0.85, marginTop: 8 }}>
        Если возникла проблема с заданиями, балансом или выводом, напиши нам в поддержку.
      </p>

      <div
        style={{
          marginTop: 12,
          borderRadius: 12,
          border: '1px solid #334155',
          padding: 12,
          background: '#0b1120',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Куда писать</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <a
            href={supportBot}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: 'none',
              padding: '10px 12px',
              borderRadius: 8,
              background: '#1976d2',
              color: '#fff',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Написать в бот поддержки
          </a>

          <a
            href={supportChat}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: 'none',
              padding: '10px 12px',
              borderRadius: 8,
              background: '#0f766e',
              color: '#fff',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Открыть чат поддержки
          </a>

          <a
            href={channelUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: 'none',
              padding: '10px 12px',
              borderRadius: 8,
              background: '#334155',
              color: '#fff',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Новости и объявления
          </a>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          borderRadius: 12,
          border: '1px solid #334155',
          padding: 12,
          background: '#020617',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Перед обращением подготовь:</h3>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5 }}>
          <li>Твой Telegram ID и username.</li>
          <li>Краткое описание проблемы.</li>
          <li>Скриншот ошибки или действия, где проблема возникла.</li>
          <li>Время, когда произошла ситуация.</li>
        </ul>
      </div>
    </div>
  );
}
