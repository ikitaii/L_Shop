import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/products.controller";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
// router.delete("/:id", deleteProduct);
// router.patch("/:id", (req, res) => {
//   console.log("PATCH WORKS");
//   res.json({ ok: true });
// });

export default router;
