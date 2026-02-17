import { useEffect, useMemo, useRef, useState } from 'react';
import { apiGet, apiPost } from '../api/client';

import shapka from '../assets/icons/shapka.svg';
import moneyTaskLogo from '../assets/icons/MoneyTask.svg';
import headerBackActive from '../assets/icons/header-back-active.svg';
import headerMenu from '../assets/icons/header-menu.svg';
import blockBalance from '../assets/icons/block-balance.svg';
import edeniza from '../assets/icons/edeniza.svg';
import paySbp from '../assets/icons/pay-sbp.svg';
import paySbpInactive from '../assets/icons/pay-sbp-inactive.svg';
import payCard from '../assets/icons/pay-card.svg';
import payCardInactive from '../assets/icons/pay-card-inactive.svg';
import payPiastrix from '../assets/icons/pay-piastrix.svg';
import payPiastrixInactive from '../assets/icons/pay-piastrix-inactive.svg';
import payUsdt from '../assets/icons/pay-usdt.svg';
import payUsdtInactive from '../assets/icons/pay-usdt-inactive.svg';
import payFkwallet from '../assets/icons/pay-fkwallet.svg';
import payFkwalletInactive from '../assets/icons/pay-fkwallet-inactive.svg';
import payTon from '../assets/icons/pay-ton.svg';
import payTonInactive from '../assets/icons/pay-ton-inactive.svg';
import dva from '../assets/icons/dva.svg';
import plashka from '../assets/icons/plashka.svg';
import buttonWithdraw from '../assets/icons/Rectangle 135.svg';

const BASE_WIDTH = 320;
const MIN_WITHDRAWAL = 500;
const MIN_AMOUNT_DISPLAY = '500 ₽';
// Настройка горизонтального смещения (в px для макета 320x568)
const SHIFT_HEADER_X_PX = 0; // только шапка: shapka, логотип, назад, бургер
// Всё под шапкой (баланс, «Выберите способ», карточки, форма) — двигай одной константой:
const SHIFT_CONTENT_X_PX = -8;

// ——— 1. Высота надписи MoneyTask в шапке: меняй только это значение ———
const MONEYTASK_LOGO_TOP_PX = 18;

// ——— 2. Блок баланса: позиция и размер самого блока (не цифры внутри) ———
const BALANCE_BLOCK_TOP_PX = 100; // базовая вертикальная позиция (не меняет размеры)
const BALANCE_BLOCK_TOP_OFFSET_PX = -10; // сдвиг вниз в пикселях (только опустить — меняй только это)
const BALANCE_BLOCK_LEFT_PX = 8;
const BALANCE_BLOCK_WIDTH_PX = 290; // сделать короче → уменьшить (например 260)
const BALANCE_BLOCK_HEIGHT_PX = 79;

// Вертикальное расположение текста/цифр внутри блока баланса
const BALANCE_PADDING_TOP_PX = 13; // отступ сверху (все строки ниже опускаются при увеличении)
const BALANCE_MARGIN_AFTER_LABEL_PX = 4; // расстояние между «Доступно для вывода» и суммой
const BALANCE_MARGIN_AFTER_AMOUNT_PX = 22; // расстояние между суммой и «Минимальная сумма...»

// Высота фиксированной шапки (shapka + кнопки); контент ниже прокручивается
const HEADER_HEIGHT_PX = 62;

// Отступ после кнопки «Вывести» до таб-бара (совпадает с TabBar: bottom 5 + height 70)
const TAB_BAR_BOTTOM_PX = 5;
const TAB_BAR_HEIGHT_PX = 70;
const GAP_BUTTON_TO_TABBAR_PX = 8;
const PADDING_BOTTOM_FOR_TABBAR_PX = TAB_BAR_BOTTOM_PX + TAB_BAR_HEIGHT_PX + GAP_BUTTON_TO_TABBAR_PX;

// Минимальная высота контента (от неё зависит «длина» скролла): больше значение — больше прокрутка
const SCROLL_CONTENT_MIN_HEIGHT_PX = 760;   // для способов кроме СБП
const SCROLL_CONTENT_MIN_HEIGHT_SBP_PX = 760; // для СБП (3 плашки, больше контента)

const METHODS = [
  { id: 'sbp', label: 'СБП', x: 8, y: 222 },
  { id: 'card', label: 'По номеру карты', x: 163, y: 222 },
  { id: 'piastrix', label: 'Piastrix', x: 8, y: 298 },
  { id: 'usdt_trc20', label: 'USDT', x: 163, y: 298 },
  { id: 'fkwallet', label: 'FKwallet', x: 8, y: 374 },
  { id: 'ton', label: 'TON', x: 163, y: 374 },
];

const PAY_ICONS_ACTIVE = {
  sbp: paySbp,
  card: payCard,
  piastrix: payPiastrix,
  usdt_trc20: payUsdt,
  fkwallet: payFkwallet,
  ton: payTon,
};
const PAY_ICONS_INACTIVE = {
  sbp: paySbpInactive,
  card: payCardInactive,
  piastrix: payPiastrixInactive,
  usdt_trc20: payUsdtInactive,
  fkwallet: payFkwalletInactive,
  ton: payTonInactive,
};

const BANKS_SBP = [
  { id: 'sber', name: 'Сбербанк' },
  { id: 'vtb', name: 'ВТБ' },
  { id: 'tbank', name: 'Тинькофф' },
  { id: 'alfa', name: 'Альфа-Банк' },
  { id: 'gazprom', name: 'Газпромбанк' },
  { id: 'open', name: 'Открытие' },
];

const WITHDRAW_MIN = 2000;
const WITHDRAW_MAX = 150000;

const ACCOUNT_PLACEHOLDER_BY_METHOD = {
  sbp: '79841388976 Без пробелов и +',
  card: 'Номер карты',
  piastrix: 'Номер Piastrix',
  usdt_trc20: 'Адрес USDT (TRC20)',
  fkwallet: 'Номер FKwallet',
  ton: 'Адрес TON',
};

const METHOD_LABEL_BY_ID = {
  sbp: 'СБП',
  card: 'Карта',
  piastrix: 'Piastrix',
  usdt_trc20: 'USDT',
  fkwallet: 'FKwallet',
  ton: 'TON',
};

const STATUS_LABELS = {
  pending: 'На рассмотрении',
  processing: 'В обработке',
  completed: 'Выплачено',
  rejected: 'Отклонено',
};

export default function Wallet({ telegramId, onBack, onWithdrawSuccess }) {
  const [user, setUser] = useState(null);
  const [method, setMethod] = useState('sbp');
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : BASE_WIDTH
  );
  const formSectionRef = useRef(null);
  const scrollAreaRef = useRef(null);
  // Форма вывода (под карточками, в одном скролле)
  const [selectedBank, setSelectedBank] = useState(null);
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankPickerOpen, setBankPickerOpen] = useState(false);
  const [historyMenuOpen, setHistoryMenuOpen] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scale = useMemo(() => {
    const clamped = Math.min(viewportWidth, 430);
    return clamped / BASE_WIDTH;
  }, [viewportWidth]);

  const px = (value) => value * scale;

  const load = async () => {
    try {
      setLoading(true);
      const u = await apiGet(`/api/users/${telegramId}`);
      setUser(u);
    } catch (e) {
      alert('Ошибка загрузки кошелька: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!telegramId || !user) return;
    const numAmount = Number(amount) || 0;
    if (numAmount < MIN_WITHDRAWAL) {
      alert(`Минимальная сумма вывода: ${MIN_WITHDRAWAL} ₽`);
      return;
    }
    if (user.balance < numAmount) {
      alert('Недостаточно средств на балансе');
      return;
    }
    let detailsValue = accountNumber.trim();
    if (method === 'sbp') {
      if (!selectedBank) {
        alert('Выберите банк');
        return;
      }
      if (!detailsValue || detailsValue.length < 10) {
        alert('Введите номер телефона для СБП (без +7)');
        return;
      }
      const digits = detailsValue.replace(/\D/g, '');
      if (digits.length === 10) detailsValue = '7' + digits;
      else if (digits.length === 11 && digits.startsWith('7')) detailsValue = digits;
      else detailsValue = digits.length >= 10 ? digits : detailsValue;
    } else {
      if (!detailsValue || detailsValue.length < 4) {
        alert('Укажите реквизиты для вывода (номер карты, адрес кошелька и т.д.)');
        return;
      }
    }
    const details = { value: detailsValue };
    if (method === 'sbp' && selectedBank) {
      const bank = BANKS_SBP.find((b) => b.id === selectedBank);
      if (bank) details.bankName = bank.name;
    }
    try {
      setWithdrawing(true);
      await apiPost(
        '/api/withdrawals/request',
        { telegramId, amount: numAmount, method, details },
        { telegramId }
      );
      setAmount('');
      setAccountNumber('');
      setSelectedBank(null);
      await load();
      alert('Заявка на вывод создана. Статус можно посмотреть во вкладке «Выплаты».');
      if (typeof onWithdrawSuccess === 'function') onWithdrawSuccess();
    } catch (e) {
      alert(e.message || 'Ошибка при создании заявки');
    } finally {
      setWithdrawing(false);
    }
  };

  const loadWithdrawals = async () => {
    if (!telegramId) return;
    try {
      setHistoryLoading(true);
      const list = await apiGet(`/api/withdrawals/user/${telegramId}`, { telegramId });
      setWithdrawals(Array.isArray(list) ? list : []);
    } catch (e) {
      setWithdrawals([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const openHistoryMenu = () => {
    setHistoryMenuOpen(true);
    loadWithdrawals();
  };

  useEffect(() => {
    if (!telegramId) return;
    load();
  }, [telegramId]);

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyOverscroll = document.body.style.overscrollBehavior;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.overscrollBehavior = prevBodyOverscroll;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.overscrollBehavior = prevHtmlOverscroll;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 16, background: '#0E101C', color: '#fff' }}>
        Загрузка...
      </div>
    );
  }

  // Позиции контента от верха скролла (контент уезжает под шапку, сквозь неё видно)
  const contentTop = (y) => y;

  const PLASHKA_GAP = 8;
  const plashkaStyle = {
    width: px(304),
    height: px(54),
    borderRadius: px(17),
    position: 'relative',
    marginBottom: px(PLASHKA_GAP),
    overflow: 'hidden',
  };
  const plashkaInputStyle = {
    position: 'absolute',
    left: px(11),
    right: px(11),
    top: 0,
    bottom: 0,
    zIndex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: px(13),
    fontWeight: 600,
    lineHeight: '100%',
    fontFamily: 'Inter, system-ui, sans-serif',
  };

  return (
    <div
      style={{
        height: '100dvh',
        width: '100%',
        maxWidth: '100vw',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 1. Фон — последний слой, сквозь шапку видно его или контент */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#0E101C',
          zIndex: 0,
        }}
      />

      {/* 2. Скролл на всю высоту: контент уезжает под шапку */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <div
          ref={scrollAreaRef}
          className="wallet-scroll-area"
          data-wallet-scroll
          onScroll={() => {
            const el = scrollAreaRef.current;
            setScrollTop(el ? el.scrollTop : 0);
          }}
          style={{
            height: '100%',
            width: 'calc(100% + 20px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehavior: 'none',
            WebkitOverflowScrolling: 'touch',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
        <div
          style={{
            position: 'relative',
            width: px(320),
            minWidth: px(320),
            flexShrink: 0,
            minHeight: px(method === 'sbp' ? SCROLL_CONTENT_MIN_HEIGHT_SBP_PX : SCROLL_CONTENT_MIN_HEIGHT_PX),
            paddingTop: px(HEADER_HEIGHT_PX),
            paddingBottom: px(PADDING_BOTTOM_FOR_TABBAR_PX),
            background: 'transparent',
          }}
        >
          <h1
            style={{
              position: 'absolute',
              top: px(contentTop(64)),
              left: px(15 + SHIFT_CONTENT_X_PX),
              margin: 0,
              fontSize: px(19),
              lineHeight: 1,
              fontWeight: 900,
            }}
          >
            Кошелёк
          </h1>

          <div
            style={{
              position: 'absolute',
              top: px(contentTop(BALANCE_BLOCK_TOP_PX + BALANCE_BLOCK_TOP_OFFSET_PX)),
              left: px(BALANCE_BLOCK_LEFT_PX + SHIFT_CONTENT_X_PX),
              width: px(BALANCE_BLOCK_WIDTH_PX),
              height: px(BALANCE_BLOCK_HEIGHT_PX),
              borderRadius: px(8),
              backgroundColor: '#121929',
              backgroundImage: `url(${blockBalance})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              paddingLeft: px(13),
              paddingTop: px(BALANCE_PADDING_TOP_PX),
            }}
          >
            <div style={{ fontSize: px(12), fontWeight: 600, lineHeight: 1, color: '#E8ECF6' }}>
              Доступно для вывода
            </div>
            <div style={{ marginTop: px(BALANCE_MARGIN_AFTER_LABEL_PX), fontSize: px(20), fontWeight: 900, lineHeight: 1, color: '#FFFFFF' }}>
              {user ? `${user.balance} ₽` : '0 ₽'}
            </div>
            <div style={{ marginTop: px(BALANCE_MARGIN_AFTER_AMOUNT_PX), fontSize: px(9), fontWeight: 600, lineHeight: 1, color: '#9CA3AF' }}>
              Минимальная сумма для вывода {MIN_AMOUNT_DISPLAY}
            </div>
          </div>

          {/* Пункт 1: edeniza + текст — параллельно пункту 2 (dva + Укажите сумму) */}
          <div
            style={{
              position: 'absolute',
              top: px(contentTop(189)),
              left: px(8 + SHIFT_CONTENT_X_PX),
              display: 'flex',
              alignItems: 'center',
              gap: px(10),
            }}
          >
            <img src={edeniza} alt="" width={px(23)} height={px(23)} style={{ display: 'block', flexShrink: 0 }} />
            <span style={{ fontSize: px(16), fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
              Выберите способ вывода
            </span>
          </div>

          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMethod(m.id);
                setSelectedBank(null);
                setAmount('');
                setAccountNumber('');
                setBankPickerOpen(false);
                setTimeout(() => {
                const scrollEl = scrollAreaRef.current;
                const formEl = formSectionRef.current;
                if (scrollEl && formEl) {
                  const top = formEl.offsetTop;
                  scrollEl.scrollTo({ top, behavior: 'smooth' });
                }
              }, 100);
              }}
              style={{
                position: 'absolute',
                top: px(contentTop(m.y - 8)),
                left: px(m.x + SHIFT_CONTENT_X_PX),
                width: px(149),
                height: px(67),
                borderRadius: px(15),
                border: `${px(2)}px solid ${method === m.id ? '#2563eb' : '#2A2A2A'}`,
                backgroundColor: '#121929',
                overflow: 'hidden',
                padding: 0,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <img
                src={method === m.id ? PAY_ICONS_ACTIVE[m.id] : PAY_ICONS_INACTIVE[m.id]}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: px(11),
                  left: px(14),
                  zIndex: 1,
                  width: m.id === 'card' ? px(59) : 'auto',
                  fontSize: px(10.5),
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: '#E8ECF6',
                }}
              >
                {m.label}
              </span>
            </button>
          ))}

          {/* Форма «Укажите сумму» — плашки 304×54, кнопка Вывести */}
          <div
            ref={formSectionRef}
            className="wallet-withdraw-form"
            style={{
              marginTop: px(450),
              width: px(320),
              paddingLeft: px(8 + SHIFT_CONTENT_X_PX),
              paddingRight: px(8),
              boxSizing: 'border-box',
            }}
          >
            {/* Заголовок: двойка (dva.svg) + Укажите сумму */}
            <div style={{ display: 'flex', alignItems: 'center', gap: px(10), marginBottom: px(24), minHeight: px(28) }}>
              <img src={dva} alt="" width={px(23)} height={px(23)} style={{ display: 'block', flexShrink: 0 }} />
              <h2 style={{ margin: 0, fontSize: px(16), fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                Укажите сумму
              </h2>
            </div>

            {/* Блок плашек: фиксированная высота (под 3 плашки), чтобы не дергалось при смене способа */}
            <div style={{ minHeight: px(54 * 3 + PLASHKA_GAP * 2) }}>
            {/* СБП: 3 плашки — Банк, Телефон, Сумма */}
            {method === 'sbp' && (
              <>
                <div style={plashkaStyle}>
                  <img src={plashka} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 0, pointerEvents: 'none' }} />
                  <button
                    type="button"
                    onClick={() => setBankPickerOpen(true)}
                    style={{
                      ...plashkaInputStyle,
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: selectedBank ? '#fff' : '#6B7280',
                    }}
                  >
                    {selectedBank ? BANKS_SBP.find((b) => b.id === selectedBank)?.name : 'Выберите банк'}
                  </button>
                </div>
                <div style={plashkaStyle}>
                  <img src={plashka} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 0, pointerEvents: 'none' }} />
                  <input
                    type="tel"
                    placeholder="Номер телефона без +7"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 11))}
                    style={{ ...plashkaInputStyle, color: accountNumber ? '#fff' : undefined }}
                    className="wallet-plashka-input"
                  />
                </div>
                <div style={plashkaStyle}>
                  <img src={plashka} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 0, pointerEvents: 'none' }} />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Сумма"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={{ ...plashkaInputStyle, color: amount ? '#fff' : undefined }}
                    className="wallet-plashka-input"
                  />
                </div>
              </>
            )}

            {/* Не СБП: 2 плашки — реквизит (карта/TON/...) и Сумма */}
            {method !== 'sbp' && (
              <>
                <div style={plashkaStyle}>
                  <img src={plashka} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 0, pointerEvents: 'none' }} />
                  <input
                    type={method === 'card' ? 'tel' : 'text'}
                    placeholder={ACCOUNT_PLACEHOLDER_BY_METHOD[method] || 'Реквизиты'}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(method === 'card' ? e.target.value.replace(/[^\d]/g, '').slice(0, 19) : e.target.value)}
                    style={{ ...plashkaInputStyle, color: accountNumber ? '#fff' : undefined }}
                    className="wallet-plashka-input"
                  />
                </div>
                <div style={plashkaStyle}>
                  <img src={plashka} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 0, pointerEvents: 'none' }} />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Сумма"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={{ ...plashkaInputStyle, color: amount ? '#fff' : undefined }}
                    className="wallet-plashka-input"
                  />
                </div>
              </>
            )}
            </div>

            {/* Кнопка Вывести — в потоке, в самом низу над таб-баром при прокрутке */}
            <div style={{ marginTop: px(24), width: px(304), height: px(50), position: 'relative' }}>
              <img
                src={buttonWithdraw}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', borderRadius: px(8) }}
              />
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={withdrawing}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: 'transparent',
                  color: '#fff',
                  fontSize: px(16),
                  fontWeight: 900,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  lineHeight: 1,
                  cursor: 'pointer',
                }}
              >
                Вывести
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Шапка поверх: сквозь прозрачную shapka видно контент или фон */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: px(HEADER_HEIGHT_PX),
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'relative', width: px(320), minWidth: px(320), height: px(HEADER_HEIGHT_PX), pointerEvents: 'auto' }}>
          <img
            src={shapka}
            alt=""
            style={{
              position: 'absolute',
              top: px(5),
              left: px(4 + SHIFT_HEADER_X_PX),
              width: px(312),
              height: px(52),
              display: 'block',
              opacity: scrollTop > 0 ? 0.50 : 0,
              transition: 'opacity 0.2s ease',
            }}
          />
          <img
            src={moneyTaskLogo}
            alt="MoneyTask"
            style={{
              position: 'absolute',
              top: px(MONEYTASK_LOGO_TOP_PX),
              left: px(100 + SHIFT_HEADER_X_PX),
              width: px(119),
              height: px(30),
              display: 'block',
              opacity: 1,
            }}
          />
          <button
            type="button"
            onClick={onBack}
            aria-label="Назад"
            style={{
              position: 'absolute',
              top: px(16),
              left: px(11 + SHIFT_HEADER_X_PX),
              width: px(30),
              height: px(30),
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={headerBackActive} alt="" width={px(30)} height={px(30)} />
          </button>
          <button
            type="button"
            aria-label="История выводов"
            onClick={openHistoryMenu}
            style={{
              position: 'absolute',
              top: px(16),
              left: px(279 + SHIFT_HEADER_X_PX),
              width: px(30),
              height: px(30),
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={headerMenu} alt="" width={px(30)} height={px(30)} />
          </button>
        </div>
      </div>

          {/* Модалка выбора банка (СБП): листаемый список */}
          {bankPickerOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 300,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
              onClick={() => setBankPickerOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: px(320),
                  maxHeight: '70vh',
                  background: '#0E101C',
                  borderTopLeftRadius: px(20),
                  borderTopRightRadius: px(20),
                  padding: px(16),
                  overflowY: 'auto',
                }}
              >
                <div style={{ color: '#9CA3AF', fontSize: px(14), marginBottom: px(12) }}>Выберите банк</div>
                {BANKS_SBP.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => { setSelectedBank(b.id); setBankPickerOpen(false); }}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: px(54),
                      padding: `0 ${px(14)}`,
                      marginBottom: px(8),
                      background: '#1E293B',
                      border: 'none',
                      borderRadius: px(17),
                      color: '#fff',
                      fontSize: px(13),
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Меню «История выводов» по бургеру: выезжает справа */}
          {historyMenuOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 310,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                }}
                onClick={() => setHistoryMenuOpen(false)}
                aria-hidden
              />
              <div
                style={{
                  width: 'min(320px, 88vw)',
                  maxWidth: '100%',
                  height: '100%',
                  background: '#0E101C',
                  boxShadow: '-4px 0 24px rgba(0,0,0,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    flexShrink: 0,
                    padding: px(16),
                    paddingTop: px(12),
                    paddingBottom: px(12),
                    borderBottom: '1px solid #1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: px(18),
                      fontWeight: 700,
                      color: '#fff',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  >
                    История выводов
                  </h2>
                  <button
                    type="button"
                    aria-label="Закрыть"
                    onClick={() => setHistoryMenuOpen(false)}
                    style={{
                      width: px(36),
                      height: px(36),
                      border: 'none',
                      background: '#1E293B',
                      borderRadius: px(10),
                      color: '#9CA3AF',
                      fontSize: px(20),
                      lineHeight: 1,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: px(16),
                    paddingBottom: px(24),
                  }}
                >
                  {historyLoading ? (
                    <div style={{ color: '#9CA3AF', fontSize: px(14), textAlign: 'center', padding: px(24) }}>
                      Загрузка...
                    </div>
                  ) : withdrawals.length === 0 ? (
                    <div style={{ color: '#6B7280', fontSize: px(14), textAlign: 'center', padding: px(24) }}>
                      Пока нет заявок на вывод
                    </div>
                  ) : (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {withdrawals.map((w) => {
                        const statusLabel = STATUS_LABELS[w.status] || w.status;
                        const statusColor =
                          w.status === 'completed'
                            ? '#22C55E'
                            : w.status === 'rejected'
                              ? '#EF4444'
                              : w.status === 'processing'
                                ? '#F59E0B'
                                : '#94A3B8';
                        const dateStr = w.createdAt
                          ? new Date(w.createdAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—';
                        return (
                          <li
                            key={w._id}
                            style={{
                              marginBottom: px(12),
                              padding: px(14),
                              background: '#1E293B',
                              borderRadius: px(12),
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: px(6),
                              }}
                            >
                              <span style={{ fontSize: px(16), fontWeight: 700, color: '#fff' }}>
                                {Number(w.amount).toLocaleString('ru-RU')} ₽
                              </span>
                              <span
                                style={{
                                  fontSize: px(12),
                                  fontWeight: 600,
                                  color: statusColor,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {statusLabel}
                              </span>
                            </div>
                            <div style={{ fontSize: px(13), color: '#94A3B8', marginBottom: px(4) }}>
                              {METHOD_LABEL_BY_ID[w.method] || w.method}
                            </div>
                            <div style={{ fontSize: px(12), color: '#6B7280' }}>{dateStr}</div>
                            {w.status === 'rejected' && w.rejectReason && (
                              <div style={{ fontSize: px(12), color: '#F87171', marginTop: px(6) }}>
                                {w.rejectReason}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
