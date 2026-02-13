// src/pages/Info.jsx
import React, { useState } from 'react';
import './Info.css';

function Info() {
  const [supportOpen, setSupportOpen] = useState(false);
  const appVersion = 'v2.1.0';

  return (
    <div className="info-container">
      <h1 className="info-title">Информация</h1>

      <section className="info-section">
        <h2>1. О проекте</h2>
        <p>
          <strong>MoneyTask</strong> — платформа, где вы выполняете задания и получаете
          реальные выплаты. Мы сотрудничаем с рекламодателями и партнёрами: они получают
          охват и вовлечённость, вы — вознаграждение за выполнение заданий. Так зарабатывают
          и пользователи, и проект.
        </p>
        <p>
          Вывод средств на карту, СБП, криптовалюту и другие способы выполняется нами
          в рабочем порядке. <strong>Вывод до 48 часов</strong> после одобрения заявки
          (срок может зависеть от способа вывода и нагрузки).
        </p>
      </section>

      <section className="info-section">
        <h2>2. Правила</h2>
        <ul className="info-list">
          <li><strong>Запрещены мультиаккаунты</strong> — один человек = один аккаунт в системе.</li>
          <li><strong>Запрещено накручивать рефералов</strong> — приглашайте только реальных пользователей. Накрутка и фейковые переходы приводят к блокировке.</li>
          <li><strong>Махинации запрещены</strong> — боты, поддельные действия, обман при выполнении заданий или выводе влекут отказ в выплате и блокировку.</li>
          <li><strong>Возможен запрос KYC</strong> — для безопасности выплат мы вправе запросить подтверждение личности (документ, селфи). Отказ от прохождения может стать причиной отказа в выводе.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>3. Сотрудничество</h2>
        <p>
          По поводу сотрудничества (реклама, интеграции, партнёрство) можете написать нам:
        </p>
        <a
          href="https://t.me/moneytask_support"
          target="_blank"
          rel="noreferrer"
          className="info-link"
        >
          Написать в поддержку (Telegram)
        </a>
        <p style={{ marginTop: 12, marginBottom: 0, fontSize: 14, opacity: 0.85 }}>
          Укажите в сообщении тему «Сотрудничество» и кратко опишите предложение.
        </p>
      </section>

      <footer className="info-footer">
        <p>Версия приложения: {appVersion}</p>
        <p>© 2024–2026 MoneyTask.</p>
      </footer>

      <button
        onClick={() => setSupportOpen(true)}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 74,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          background: '#22c55e',
          color: '#022c22',
          fontSize: 24,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 10px 24px rgba(34, 197, 94, 0.35)',
          zIndex: 40,
        }}
        title="Техподдержка"
        aria-label="Открыть техподдержку"
      >
        🎧
      </button>

      {supportOpen && (
        <div
          onClick={() => setSupportOpen(false)}
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
              borderRadius: 16,
              background: '#0b1120',
              border: '1px solid #334155',
              color: '#e5e7eb',
              padding: 14,
              boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <h3 style={{ margin: 0 }}>Техническая поддержка</h3>
              <button
                onClick={() => setSupportOpen(false)}
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

            <p style={{ marginTop: 0, opacity: 0.9 }}>
              Если возникла проблема с заданиями, балансом или выводом, напиши нам:
            </p>

            <div style={{ display: 'grid', gap: 8 }}>
              <a
                href="https://t.me/moneytaskdemo_bot"
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
                href="https://t.me/moneytask_support"
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
                href="https://t.me/moneytask_channel"
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

            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                opacity: 0.85,
                lineHeight: 1.4,
              }}
            >
              Перед обращением подготовь Telegram ID, краткое описание проблемы и
              скриншот.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Info;
