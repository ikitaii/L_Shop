import { Request, Response } from "express";
import { users } from "../data/users.data";

export const register = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: Date.now(),
    email,
    password,
  };

  users.push(newUser);

  res.status(201).json(newUser);
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json(user);
};
