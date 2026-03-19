import { Request, Response } from "express";
import { users } from "../data/users.data";
export const getUsers = (req: Request, res: Response) => {
  res.json(users);
};

export const register = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Fill all fields" });
  }

  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: Date.now(),
    email,
    password
  };

  users.push(newUser);

  res.json(newUser);
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json(user);
};
