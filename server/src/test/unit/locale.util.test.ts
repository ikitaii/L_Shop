import {
  guessCountryFromAcceptLanguage,
  guessLocaleFromAcceptLanguage,
  localeByCountryCode,
  normalizeLocale,
} from "../../utils/locale.util";

describe("locale util", () => {
  it("normalizes locale", () => {
    expect(normalizeLocale("be")).toBe("be");
    expect(normalizeLocale("ru")).toBe("ru");
    expect(normalizeLocale("unknown")).toBe("ru");
  });

  it("guesses locale by accept-language", () => {
    expect(guessLocaleFromAcceptLanguage("be-BY,be;q=0.9")).toBe("be");
    expect(guessLocaleFromAcceptLanguage("ru-RU,ru;q=0.9")).toBe("ru");
  });

  it("resolves country and locale by country code", () => {
    expect(localeByCountryCode("US")).toBe("ru");
    expect(localeByCountryCode("BY")).toBe("be");
    expect(guessCountryFromAcceptLanguage("be-BY,be;q=0.8")).toBe("Беларусі");
  });
});
