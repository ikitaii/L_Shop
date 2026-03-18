import { Router } from "express";

const router = Router();

router.get("/test", (req, res) => {
  res.json({ message: "test route works" });
});

export default router;
