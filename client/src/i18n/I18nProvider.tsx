import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";
import type { Locale } from "./messages";
import { messages } from "./messages";

type I18nContextValue = {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (next: Locale) => Promise<void>;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    api
      .getLocale()
      .then((data) => {
        setLocaleState(data.locale === "be" ? "be" : "ru");
      })
      .catch(() => {
        setLocaleState("ru");
      });
  }, []);

  const setLocale = async (next: Locale) => {
    await api.setLocale(next);
    setLocaleState(next);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: (key: string) => messages[locale][key] || key,
      setLocale,
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("I18nProvider is not mounted");
  }
  return ctx;
};
