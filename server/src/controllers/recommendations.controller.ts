import { Request, Response } from "express";
import { PRODUCTS_PATH, RECOMMENDATIONS_PATH } from "../constants/paths";
import { Product } from "../types/product";
import { RecommendationProfile } from "../types/recommendations";
import { readJSON, writeJSON } from "../utils/file.util";
import { getProductTags, injectRecommendations, mergePreference, scoreProduct } from "../utils/recommendations.util";

const getUserIdFromRequest = (req: Request): number | null => {
  const userId = Number(req.cookies.userId);
  if (!userId) {
    return null;
  }
  return userId;
};

export const likeProduct = (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const productId = Number(req.body?.productId);
  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }

  const products: Product[] = readJSON(PRODUCTS_PATH);
  const product = products.find((item) => item.id === productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const profiles: RecommendationProfile[] = readJSON(RECOMMENDATIONS_PATH);
  let profile = profiles.find((item) => item.userId === userId);
  if (!profile) {
    profile = { userId, preferences: [] };
    profiles.push(profile);
  }

  const nowIso = new Date().toISOString();
  const tags = getProductTags(product);
  tags.forEach((tag) => {
    profile!.preferences = mergePreference(profile!.preferences, tag, nowIso);
  });

  writeJSON(RECOMMENDATIONS_PATH, profiles);

  return res.json({ message: "Liked", tags });
};

export const getRecommendations = (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const products: Product[] = readJSON(PRODUCTS_PATH);
  const profiles: RecommendationProfile[] = readJSON(RECOMMENDATIONS_PATH);
  const profile = profiles.find((item) => item.userId === userId);

  if (!profile || profile.preferences.length === 0) {
    return res.json({
      recommended: [],
      feed: products,
    });
  }

  const nowMs = Date.now();
  const scored = products
    .map((product) => ({
      product,
      score: scoreProduct(product, profile.preferences, nowMs),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);

  const feed = injectRecommendations(products, scored);

  return res.json({
    recommended: scored.slice(0, 8),
    feed,
  });
};
