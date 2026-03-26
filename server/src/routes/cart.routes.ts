import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} from "../controllers/cart.controller";

const router = Router();

router.get("/", getCart);
router.post("/", addToCart);
router.patch("/:id", updateCart);  
router.delete("/:id", removeFromCart);

export default router;
