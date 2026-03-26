import { Request, Response } from "express";
import { readJSON, writeJSON } from "../utils/file.util";
import { User } from "../types/user";
import path from "path";

const USERS_PATH = path.join(__dirname, "../data/users.json");

export const register = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const users: User[] = readJSON(USERS_PATH);

  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser: User = {
    id: Date.now(),
    email,
    password,
  };

 users.push(newUser);
writeJSON(USERS_PATH, users);

res.cookie("userId", newUser.id, {
  httpOnly: true,
  maxAge: 10 * 60 * 1000
});

res.status(201).json(newUser);

};
export const me = (req: Request, res: Response) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  const users: User[] = readJSON(USERS_PATH);
  const user = users.find(u => u.id === Number(userId));

  if (!user) {
    return res.status(401).json({ message: "Пользователь не найден" });
  }

  res.json(user);
};


export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const users: User[] = readJSON(USERS_PATH);

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
res.cookie("userId", user.id, {
  httpOnly: true,
  maxAge: 10 * 60 * 1000
});

return res.json(user);
};
