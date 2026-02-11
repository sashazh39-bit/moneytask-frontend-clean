import { useEffect, useMemo, useState } from 'react';
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

const BASE_WIDTH = 320;
const MIN_AMOUNT_DISPLAY = '500 ₽';
// Настройка горизонтального смещения групп (в px для макета 320x568)
const SHIFT_HEADER_X_PX = -6; // shapka + стрелка + бургер + заголовок + блок баланса
const SHIFT_PAYMENTS_X_PX = -6; // edeniza + заголовок выбора + все карточки платежей

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

export default function Wallet({ telegramId, onBack }) {
  const [user, setUser] = useState(null);
  const [method, setMethod] = useState('sbp');
  const [loading, setLoading] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : BASE_WIDTH
  );

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

  return (
    <div
      style={{
        height: '100dvh',
        background: '#0E101C',
        color: '#fff',
        overflowX: 'hidden',
        overflowY: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: 0,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: px(320),
          height: '100%',
        }}
      >
        {/* Плашка shapka */}
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

        {/* Логотип MoneyTask по центру шапки */}
        <img
          src={moneyTaskLogo}
          alt="MoneyTask"
          style={{
            position: 'absolute',
            top: px(16),
            left: px(100 + SHIFT_HEADER_X_PX),
            width: px(119),
            height: px(30),
            display: 'block',
            opacity: 1,
          }}
        />

        {/* Стрелка назад */}
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

        {/* Бургер */}
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

        {/* Заголовок */}
        <h1
          style={{
            position: 'absolute',
            top: px(64),
            left: px(15 + SHIFT_HEADER_X_PX),
            margin: 0,
            fontSize: px(19),
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          Кошелёк
        </h1>

        {/* Блок баланса */}
        <div
          style={{
            position: 'absolute',
            top: px(109),
            left: px(8 + SHIFT_HEADER_X_PX),
            width: px(304),
            height: px(79),
            borderRadius: px(8),
            backgroundColor: '#121929',
            backgroundImage: `url(${blockBalance})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            paddingLeft: px(13),
            paddingTop: px(13),
          }}
        >
          <div
            style={{
              fontSize: px(12),
              fontWeight: 600,
              lineHeight: 1,
              color: '#E8ECF6',
            }}
          >
            Доступно для вывода
          </div>
          <div
            style={{
              marginTop: px(4),
              fontSize: px(20),
              fontWeight: 900,
              lineHeight: 1,
              color: '#FFFFFF',
            }}
          >
            {user ? `${user.balance} ₽` : '0 ₽'}
          </div>
          <div
            style={{
              marginTop: px(6),
              fontSize: px(9),
              fontWeight: 600,
              lineHeight: 1,
              color: '#9CA3AF',
            }}
          >
            Минимальная сумма для вывода {MIN_AMOUNT_DISPLAY}
          </div>
        </div>

        {/* Иконка + текст выбора способа */}
        <img
          src={edeniza}
          alt=""
          style={{
            position: 'absolute',
            top: px(189),
            left: px(8 + SHIFT_PAYMENTS_X_PX),
            width: px(15),
            height: px(15),
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: px(189),
            left: px(25 + SHIFT_PAYMENTS_X_PX),
            fontSize: px(16),
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          Выберите способ вывода
        </div>

        {/* Карточки платежных систем */}
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            style={{
              position: 'absolute',
              top: px(m.y - 8),
              left: px(m.x + SHIFT_PAYMENTS_X_PX),
              width: px(149),
              height: px(67),
              borderRadius: px(15),
              border: method === m.id ? `${px(2)}px solid #2563eb` : `${px(1)}px solid #2A2A2A`,
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
      </div>
    </div>
  );
}
