import { useEffect, useMemo, useRef, useState } from 'react';
import { apiGet } from '../api/client';

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
const MIN_AMOUNT_DISPLAY = '500 ₽';
// Настройка горизонтального смещения групп (в px для макета 320x568)
const SHIFT_HEADER_X_PX = -6; // shapka + стрелка + бургер + заголовок + блок баланса
const SHIFT_PAYMENTS_X_PX = -6; // edeniza + заголовок выбора + все карточки платежей

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

export default function Wallet({ telegramId, onBack }) {
  const [user, setUser] = useState(null);
  const [method, setMethod] = useState('sbp');
  const [loading, setLoading] = useState(true);
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

  // Смещение контента в прокручиваемой зоне (относительно верха шапки)
  const contentTop = (y) => y - HEADER_HEIGHT_PX;

  const PLASHKA_GAP = 8;
  const plashkaStyle = {
    width: px(304),
    height: px(54),
    borderRadius: px(17),
    backgroundImage: `url(${plashka})`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    marginBottom: px(PLASHKA_GAP),
  };
  const plashkaInputStyle = {
    position: 'absolute',
    left: px(11),
    right: px(11),
    top: 0,
    bottom: 0,
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
        background: '#0E101C',
        color: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Фиксированная шапка: только плашка + логотип + назад + бургер */}
      <div
        style={{
          flexShrink: 0,
          minHeight: px(HEADER_HEIGHT_PX),
          height: px(HEADER_HEIGHT_PX),
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ position: 'relative', width: px(320), height: px(HEADER_HEIGHT_PX) }}>
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
            aria-label="Меню"
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

      {/* Прокручиваемая область: заголовок, блок баланса, способы вывода, форма */}
      <div
        ref={scrollAreaRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarGutter: 'stable',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: px(320),
            minHeight: px(method === 'sbp' ? 1000 : 880),
            paddingBottom: px(100),
          }}
        >
          <h1
            style={{
              position: 'absolute',
              top: px(contentTop(64)),
              left: px(15 + SHIFT_HEADER_X_PX),
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
              left: px(BALANCE_BLOCK_LEFT_PX + SHIFT_HEADER_X_PX),
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

          <img
            src={edeniza}
            alt=""
            style={{
              position: 'absolute',
              top: px(contentTop(189)),
              left: px(8 + SHIFT_PAYMENTS_X_PX),
              width: px(15),
              height: px(15),
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: px(contentTop(189)),
              left: px(25 + SHIFT_PAYMENTS_X_PX),
              fontSize: px(16),
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            Выберите способ вывода
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
                left: px(m.x + SHIFT_PAYMENTS_X_PX),
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
              paddingLeft: px(8),
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

            {/* Кнопка Вывести: Rectangle 135.svg + текст */}
            <div style={{ marginTop: px(24), marginBottom: px(40), width: px(304), height: px(50), position: 'relative' }}>
              <img
                src={buttonWithdraw}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', borderRadius: px(8) }}
              />
              <button
                type="button"
                onClick={() => {}}
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
                  background: '#121929',
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
                      padding: px(14),
                      marginBottom: px(8),
                      background: selectedBank === b.id ? '#1E293B' : '#1a1f2e',
                      border: 'none',
                      borderRadius: px(12),
                      color: '#fff',
                      fontSize: px(15),
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
