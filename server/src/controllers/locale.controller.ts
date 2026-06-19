import { Request, Response } from "express";
import {
  guessCountryFromAcceptLanguage,
  guessLocaleFromAcceptLanguage,
  localeByCountryCode,
  normalizeLocale,
} from "../utils/locale.util";

export const getLocale = (req: Request, res: Response) => {
  const locale = normalizeLocale(req.cookies.locale);
  res.json({ locale });
};

export const detectLocale = (req: Request, res: Response) => {
  const acceptLanguage = req.headers["accept-language"];
  const country = String(req.query.country || "").trim();

  const locale = country
    ? localeByCountryCode(country)
    : guessLocaleFromAcceptLanguage(typeof acceptLanguage === "string" ? acceptLanguage : undefined);

  const detectedCountry = country || guessCountryFromAcceptLanguage(typeof acceptLanguage === "string" ? acceptLanguage : undefined);

  res.json({
    country: detectedCountry,
    locale,
  });
};

export const setLocale = (req: Request, res: Response) => {
  const locale = normalizeLocale(req.body?.locale);

  res.cookie("locale", locale, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  res.json({ locale });
};
