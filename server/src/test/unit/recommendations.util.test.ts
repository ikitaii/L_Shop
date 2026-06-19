import { Product } from "../../types/product";
import { RecommendationPreference } from "../../types/recommendations";
import {
  applyDecay,
  getProductTags,
  injectRecommendations,
  mergePreference,
  scoreProduct,
} from "../../utils/recommendations.util";

const product: Product = {
  id: 1,
  name: "P1",
  description: "Desc",
  price: 10,
  category: "cat",
  image: "/img.png",
  rating: 1,
  stock: 1,
  available: true,
  tags: ["cat", "tag1"],
};

describe("recommendations util", () => {
  it("gets product tags with fallback", () => {
    expect(getProductTags(product)).toEqual(["cat", "tag1"]);
    expect(getProductTags({ ...product, tags: undefined })).toEqual(["cat"]);
  });

  it("merges preferences and applies decay", () => {
    const list: RecommendationPreference[] = [];
    const nowIso = new Date().toISOString();
    mergePreference(list, "tag1", nowIso);
    expect(list[0].weight).toBe(1);
    mergePreference(list, "tag1", nowIso);
    expect(list[0].weight).toBe(2);

    const decayed = applyDecay(2, nowIso, Date.now() + 2 * 24 * 60 * 60 * 1000);
    expect(decayed).toBeLessThan(2);
  });

  it("scores products and injects recommendations", () => {
    const prefs: RecommendationPreference[] = [
      { tag: "tag1", weight: 2, updatedAt: new Date().toISOString() },
    ];
    const score = scoreProduct(product, prefs, Date.now());
    expect(score).toBeGreaterThan(0);

    const catalog = [product, { ...product, id: 2 }, { ...product, id: 3 }, { ...product, id: 4 }];
    const recs = [{ ...product, id: 99 }];
    const injected = injectRecommendations(catalog, recs, 2);
    expect(injected.some((item) => item.id === 99)).toBe(true);
  });
});
