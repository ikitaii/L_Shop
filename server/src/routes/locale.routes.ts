import { Router } from "express";
import { detectLocale, getLocale, setLocale } from "../controllers/locale.controller";

const router = Router();

router.get("/", getLocale);
router.get("/detect", detectLocale);
router.post("/", setLocale);

export default router;
