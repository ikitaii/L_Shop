export type AppLocale = "ru" | "be";

const countryToLocale: Record<string, AppLocale> = {
  BY: "be",
  RU: "ru",
  KZ: "ru",
  US: "ru",
  GB: "ru",
  DE: "ru",
  FR: "ru",
};

export const normalizeLocale = (value: unknown): AppLocale => {
  if (value === "be") {
    return "be";
  }
  return "ru";
};

export const guessLocaleFromAcceptLanguage = (header: string | undefined): AppLocale => {
  if (!header) {
    return "ru";
  }

  const normalized = header.toLowerCase();

  if (normalized.includes("be")) {
    return "be";
  }

  return "ru";
};

export const guessCountryFromAcceptLanguage = (header: string | undefined): string => {
  if (!header) {
    return "Беларуси";
  }

  const normalized = header.toLowerCase();

  if (normalized.includes("ru")) {
    return "России";
  }
  if (normalized.includes("be")) {
    return "Беларусі";
  }
  if (normalized.includes("en-us")) {
    return "США";
  }
  if (normalized.includes("en-gb")) {
    return "Великобритании";
  }
  return "Беларуси";
};

export const localeByCountryCode = (countryCode: string | undefined): AppLocale => {
  if (!countryCode) {
    return "ru";
  }
  return countryToLocale[countryCode.toUpperCase()] ?? "ru";
};
