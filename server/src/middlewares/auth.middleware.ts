import { Request, Response, NextFunction } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  (req as any).userId = userId;

  next();
};
