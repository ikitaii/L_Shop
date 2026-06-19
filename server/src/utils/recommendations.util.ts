import { Product } from "../types/product";
import { RecommendationPreference } from "../types/recommendations";

const HALF_LIFE_MS = 24 * 60 * 60 * 1000;

export const getProductTags = (product: Product): string[] => {
  if (Array.isArray(product.tags) && product.tags.length > 0) {
    return product.tags;
  }
  return [product.category];
};

export const applyDecay = (weight: number, updatedAt: string, nowMs: number): number => {
  const updatedMs = new Date(updatedAt).getTime();
  if (Number.isNaN(updatedMs)) {
    return weight;
  }

  const elapsed = Math.max(0, nowMs - updatedMs);
  const decayFactor = Math.pow(0.5, elapsed / HALF_LIFE_MS);

  return weight * decayFactor;
};

export const mergePreference = (
  preferences: RecommendationPreference[],
  tag: string,
  nowIso: string
): RecommendationPreference[] => {
  const existing = preferences.find((item) => item.tag === tag);
  if (existing) {
    existing.weight += 1;
    existing.updatedAt = nowIso;
    return preferences;
  }

  preferences.push({
    tag,
    weight: 1,
    updatedAt: nowIso,
  });

  return preferences;
};

export const scoreProduct = (
  product: Product,
  preferences: RecommendationPreference[],
  nowMs: number
): number => {
  const tags = getProductTags(product);

  return preferences.reduce((sum, pref) => {
    if (!tags.includes(pref.tag)) {
      return sum;
    }

    return sum + applyDecay(pref.weight, pref.updatedAt, nowMs);
  }, 0);
};

export const injectRecommendations = (
  catalog: Product[],
  recommended: Product[],
  every: number = 4
): Product[] => {
  if (recommended.length === 0) {
    return catalog;
  }

  const result: Product[] = [];
  let recIndex = 0;

  for (let index = 0; index < catalog.length; index += 1) {
    result.push(catalog[index]);

    const isInjectionPoint = (index + 1) % every === 0;
    if (isInjectionPoint && recIndex < recommended.length) {
      const candidate = recommended[recIndex];
      const alreadyInList = result.some((item) => item.id === candidate.id);
      if (!alreadyInList) {
        result.push(candidate);
      }
      recIndex += 1;
    }
  }

  return result;
};
