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
        <h2>О проекте MoneyTask</h2>
        <p>
          <strong>MoneyTask</strong> — Telegram mini app, где пользователи выполняют
          простые задания и получают вознаграждение на внутренний баланс.
        </p>
        <p>
          Мы развиваем платформу как удобный сервис с прозрачными правилами, понятной
          системой заданий и безопасными выводами средств.
        </p>
      </section>

      <section className="info-section">
        <h2>Как это работает</h2>
        <ol className="info-list">
          <li>Открываете приложение через Telegram-бота.</li>
          <li>Выполняете задания в разделе «Задания».</li>
          <li>После подтверждения задания награда поступает на баланс.</li>
          <li>Подаёте заявку на вывод в разделе «Кошелёк».</li>
          <li>Следите за статусом выплат в разделе «Выплаты».</li>
        </ol>
      </section>

      <section className="info-section">
        <h2>Правила использования</h2>
        <ul className="info-list">
          <li>Один аккаунт Telegram = один аккаунт в системе.</li>
          <li>Запрещены накрутка, боты и искусственная активность.</li>
          <li>Попытка мошенничества может привести к блокировке аккаунта.</li>
          <li>Некоторые задания проверяются автоматически, часть — по ссылкам.</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>Выплаты и сроки</h2>
        <p>
          Заявки на вывод проходят обработку в порядке очереди. Время обработки может
          зависеть от нагрузки и выбранного способа вывода.
        </p>
        <p>
          По заданию «Репост» награда начисляется в течение 24 часов после отправки
          ссылки.
        </p>
      </section>

      <section className="info-section">
        <h2>Безопасность</h2>
        <p>
          Никому не передавайте коды подтверждения, seed-фразы и пароли от кошельков.
          Поддержка никогда не запрашивает такие данные.
        </p>
      </section>

      <section className="info-section">
        <h2>FAQ</h2>
        <h3>Почему задание не зачлось сразу?</h3>
        <p>
          Некоторые задания требуют дополнительного времени на обработку. Если прошло
          более 24 часов, напишите в техподдержку.
        </p>
        <h3>Почему отклонена заявка на вывод?</h3>
        <p>
          Обычно причина связана с некорректными реквизитами. Проверь данные и создай
          новую заявку.
        </p>
        <h3>Где связаться с поддержкой?</h3>
        <p>Используй отдельную вкладку «Поддержка» в нижнем меню приложения.</p>
      </section>

      <section className="info-section">
        <h2>Юридическая информация</h2>
        <p>
          Используя приложение, вы соглашаетесь с внутренними правилами платформы.
          Администрация оставляет за собой право обновлять правила для повышения
          безопасности и стабильности сервиса.
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
