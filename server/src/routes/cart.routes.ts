import { Router } from "express";
import { getCart, addToCart, deleteFromCart } from "../controllers/cart.controller";

const router = Router();

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:id", deleteFromCart);

export default router;
