export function useTelegram() {
  const tg = window.Telegram?.WebApp;

  const onReady = () => {
    tg?.ready();
  };

  return { tg, onReady };
}
