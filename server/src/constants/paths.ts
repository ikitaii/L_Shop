import path from "path";

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "../data");

export const USERS_PATH = path.join(DATA_DIR, "users.json");
export const PRODUCTS_PATH = path.join(DATA_DIR, "products.json");
export const CART_PATH = path.join(DATA_DIR, "cart.json");
export const REVIEWS_PATH = path.join(DATA_DIR, "reviews.json");
export const RECOMMENDATIONS_PATH = path.join(DATA_DIR, "recommendations.json");
