import { NextFunction, Request, Response } from "express";
import { readJSON } from "../utils/file.util";
import { User } from "../types/user";
import { USERS_PATH } from "../constants/paths";

const OWNER_TTL_MS = 30 * 60 * 1000;

export const requireRole =
  (roles: Array<"owner" | "manager">) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.cookies.userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users: User[] = readJSON(USERS_PATH);
    const user = users.find((item) => item.id === userId);

    if (!user || !user.role || !roles.includes(user.role as "owner" | "manager")) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (user.role === "owner") {
      const ownerSessionStart = Number(req.cookies.ownerSessionStart);
      const now = Date.now();
      if (!ownerSessionStart || now - ownerSessionStart > OWNER_TTL_MS) {
        res.cookie("ownerSessionStart", "", {
          httpOnly: true,
          expires: new Date(0),
          path: "/",
        });
        return res.status(401).json({ message: "Owner session expired" });
      }
    }

    req.userRole = user.role;
    req.userId = userId;
    return next();
  };
