import { Router } from "express";
import { getRecommendations, likeProduct } from "../controllers/recommendations.controller";
import { isAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", isAuth, getRecommendations);
router.post("/like", isAuth, likeProduct);

export default router;
