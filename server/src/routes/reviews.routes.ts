import { Router } from "express";
import { createReview, getProductReviews } from "../controllers/reviews.controller";
import { isAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:productId", getProductReviews);
router.post("/", isAuth, createReview);

export default router;
