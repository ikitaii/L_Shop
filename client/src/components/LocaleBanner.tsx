import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useI18n } from "../i18n/I18nProvider";
import "../styles/locale-banner.css";

export const LocaleBanner = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("Беларуси");
  const [detected, setDetected] = useState<"ru" | "be">("ru");
  const { t, setLocale } = useI18n();

  useEffect(() => {
    const dismissed = sessionStorage.getItem("locale-banner-dismissed");
    if (dismissed) {
      return;
    }

    api
      .detectLocale()
      .then((data) => {
        setCountry(data.country || "Беларуси");
        setDetected(data.locale === "be" ? "be" : "ru");
        setOpen(true);
      })
      .catch(() => {
        setOpen(false);
      });
  }, []);

  if (!open) {
    return null;
  }

  const close = () => {
    sessionStorage.setItem("locale-banner-dismissed", "1");
    setOpen(false);
  };

  const switchLocale = async () => {
    const next = detected === "ru" ? "be" : "ru";
    await setLocale(next);
    close();
  };

  const keepLocale = async () => {
    await setLocale(detected);
    close();
  };

  return (
    <div className="locale-banner">
      <span>
        {t("localeBannerTitle")} {country}?
      </span>
      <div className="locale-banner-actions">
        <button onClick={keepLocale}>{t("keepLanguage")}</button>
        <button onClick={switchLocale}>{t("switchLanguage")}</button>
      </div>
    </div>
  );
};
