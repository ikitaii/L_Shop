import { Router } from "express";
import { register, login,me } from "../controllers/auth.controller";
import { isAuth } from "../middlewares/auth.middleware";
import { addToCart } from "../controllers/cart.controller";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/cart", isAuth, addToCart);
router.get("/me", me);    
router.get("/", isAuth, (req, res) => {
  res.json({ message: "Это корзина (доступ есть)" });
});

export default router;
