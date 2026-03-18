import { Router } from "express";
import { getUsers, register, login } from "../controllers/users.controller";

const router = Router();

router.get("/", getUsers);
router.post("/register", register);
router.post("/login", login);

export default router;
