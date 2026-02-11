import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

import shapka from '../assets/icons/shapka.svg';
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

const MIN_AMOUNT_DISPLAY = '500 ₽';

const METHODS = [
  { id: 'sbp', label: 'СБП' },
  { id: 'card', label: 'По номеру карты' },
  { id: 'piastrix', label: 'Piastrix' },
  { id: 'usdt_trc20', label: 'USDT' },
  { id: 'fkwallet', label: 'FKwallet' },
  { id: 'ton', label: 'TON' },
];

const TOP_ROW_HEIGHT = 48;
const SHAPKA_HEIGHT = 52;
const headerHeight = TOP_ROW_HEIGHT + SHAPKA_HEIGHT;
const tabBarHeight = 60;

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

  if (loading) {
    return (
      <div style={{ padding: 16, paddingTop: headerHeight + 16, background: '#0E101C', color: '#fff' }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0E101C',
        color: '#fff',
        paddingBottom: tabBarHeight + 24,
      }}
    >
      {/* Верхняя строка: кнопка назад | заголовок | меню */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: TOP_ROW_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 12,
          paddingRight: 12,
          background: '#0E101C',
          zIndex: 101,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Назад"
          style={{
            width: 40,
            height: 40,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <img src={headerBackActive} alt="" width={30} height={30} style={{ display: 'block' }} />
        </button>
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          Кошелёк
        </h1>
        <button
          type="button"
          aria-label="Меню"
          style={{
            width: 40,
            height: 40,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <img src={headerMenu} alt="" width={30} height={30} style={{ display: 'block' }} />
        </button>
      </div>

      {/* Полоска shapka под кнопками */}
      <div
        style={{
          position: 'fixed',
          top: TOP_ROW_HEIGHT,
          left: 0,
          right: 0,
          height: SHAPKA_HEIGHT,
          backgroundImage: `url(${shapka})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 100,
        }}
      />

      <div style={{ paddingTop: headerHeight + 16, paddingLeft: 16, paddingRight: 16 }}>
        {/* Блок баланса: фон из block-balance.svg + запасной цвет, чтобы блок всегда виден */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 79,
            borderRadius: 8,
            backgroundColor: '#121929',
            backgroundImage: `url(${blockBalance})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            marginBottom: 20,
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 14, color: '#e5e7eb', marginBottom: 4 }}>
            Доступно для вывода
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#60a5fa' }}>
            {user ? `${user.balance} ₽` : '0 ₽'}
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
            Минимальная сумма для вывода {MIN_AMOUNT_DISPLAY}
          </div>
        </div>

        {/* Иконка edeniza + "Выберите способ вывода" (один элемент, без дублирующего квадрата "1") */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <img src={edeniza} alt="" width={28} height={28} style={{ flexShrink: 0 }} />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            Выберите способ вывода
          </h2>
        </div>

        {/* Сетка способов вывода: иконка на весь блок, подпись сверху */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              style={{
                position: 'relative',
                display: 'block',
                padding: 0,
                borderRadius: 12,
                border: method === m.id ? '2px solid #2563eb' : '1px solid #2a2a2a',
                background: method === m.id ? '#1e3a5f' : '#121929',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 15,
                minHeight: 72,
                overflow: 'hidden',
              }}
            >
              <img
                src={method === m.id ? PAY_ICONS_ACTIVE[m.id] : PAY_ICONS_INACTIVE[m.id]}
                alt=""
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'block',
                  padding: '10px 12px',
                  fontWeight: 500,
                }}
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
