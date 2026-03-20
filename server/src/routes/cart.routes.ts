import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCart,
  deleteFromCart,
} from "../controllers/cart.controller";
import { isAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", isAuth, getCart);
router.post("/", isAuth, addToCart);
router.patch("/", isAuth, updateCart);
router.delete("/:id", isAuth, deleteFromCart);

export default router;
