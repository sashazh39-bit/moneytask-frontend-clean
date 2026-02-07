// src/pages/Info.jsx
import React from 'react';
import './Info.css';

function Info() {
  return (
    <div className="info-container">
      <h1 className="info-title">Информация</h1>

      <section className="info-section">
        <h2>О сервисе</h2>
        <p>
          <strong>MoneyTask</strong> — это платформа для заработка на выполнении заданий.
          Здесь будет краткая информация о проекте без конкретных сумм и обещаний.
        </p>
      </section>

      <section className="info-section">
        <h2>Как это работает</h2>
        <ol className="info-list">
          <li>Авторизуетесь через Telegram.</li>
          <li>Выполняете задания в разделе «Задания».</li>
          <li>Накопленные средства выводите в разделе «Выплаты».</li>
        </ol>
      </section>

      <section className="info-section">
        <h2>Контакты</h2>
        <p>По вопросам работы сервиса обращайтесь в Telegram‑поддержку.</p>
      </section>

      <footer className="info-footer">
        <p>© 2024–2026 MoneyTask.</p>
      </footer>
    </div>
  );
}

export default Info;
