import { Request, Response } from "express";
import { readJSON, writeJSON } from "../utils/file.util";

const USERS_PATH = "../data/users.json";

export const getUsers = (req: Request, res: Response) => {
  const users = readJSON(USERS_PATH);
  res.json(users);
};

export const register = (req: Request, res: Response) => {
  const users = readJSON(USERS_PATH);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Fill all fields" });
  }

  const existingUser = users.find((u: any) => u.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: Date.now(),
    email,
    password
  };

  users.push(newUser);

  writeJSON(USERS_PATH, users); 

  res.json(newUser);
};

export const login = (req: Request, res: Response) => {
  const users = readJSON(USERS_PATH);

  const { email, password } = req.body;

  const user = users.find(
    (u: any) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json(user);
};
