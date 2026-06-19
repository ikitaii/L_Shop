import { Router } from "express";
import {
  assignManagerRole,
  createAdminProduct,
  getAdminProducts,
  ownerSessionLogin,
  updateAdminProduct,
} from "../controllers/admin.controller";
import { isAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.post("/session-login", ownerSessionLogin);
router.get("/products", isAuth, requireRole(["owner", "manager"]), getAdminProducts);
router.post("/products", isAuth, requireRole(["owner", "manager"]), createAdminProduct);
router.patch("/products/:id", isAuth, requireRole(["owner", "manager"]), updateAdminProduct);
router.patch("/users/:userId/manager", isAuth, requireRole(["owner"]), assignManagerRole);

export default router;
