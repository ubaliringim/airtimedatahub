import { useEffect, useState } from "react";

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export function useTelegramUser() {
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    if (
      window.Telegram &&
      window.Telegram.WebApp &&
      window.Telegram.WebApp.initDataUnsafe &&
      window.Telegram.WebApp.initDataUnsafe.user
    ) {
      setTelegramUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  return telegramUser;
} 