import { Request, Response } from "express";
import { PRODUCTS_PATH, REVIEWS_PATH } from "../constants/paths";
import { Product } from "../types/product";
import { Review } from "../types/review";
import { readJSON, writeJSON } from "../utils/file.util";

const getAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) {
    return 0;
  }
  const sum = reviews.reduce((acc, item) => acc + item.rating, 0);
  return Number((sum / reviews.length).toFixed(2));
};

export const getProductReviews = (req: Request, res: Response) => {
  const productId = Number(req.params.productId);
  if (!productId) {
    return res.status(400).json({ message: "Invalid productId" });
  }

  const reviews: Review[] = readJSON(REVIEWS_PATH);
  const productReviews = reviews.filter((item) => item.productId === productId);

  return res.json({
    averageRating: getAverageRating(productReviews),
    reviews: productReviews,
  });
};

export const createReview = (req: Request, res: Response) => {
  const userId = Number(req.cookies.userId);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { productId, rating, comment } = req.body;
  const numericProductId = Number(productId);
  const numericRating = Number(rating);

  if (!numericProductId || !comment || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: "Invalid review payload" });
  }

  const products: Product[] = readJSON(PRODUCTS_PATH);
  const productExists = products.some((item) => item.id === numericProductId);
  if (!productExists) {
    return res.status(404).json({ message: "Product not found" });
  }

  const reviews: Review[] = readJSON(REVIEWS_PATH);
  const newReview: Review = {
    id: Date.now(),
    productId: numericProductId,
    userId,
    rating: numericRating,
    comment: String(comment),
    createdAt: new Date().toISOString(),
  };

  reviews.push(newReview);
  writeJSON(REVIEWS_PATH, reviews);

  const productReviews = reviews.filter((item) => item.productId === numericProductId);
  const averageRating = getAverageRating(productReviews);
  const updatedProducts = products.map((item) =>
    item.id === numericProductId ? { ...item, rating: averageRating } : item
  );
  writeJSON(PRODUCTS_PATH, updatedProducts);

  return res.status(201).json(newReview);
};
