import { Request, Response } from "express";
import { PRODUCTS_PATH, USERS_PATH } from "../constants/paths";
import { Product } from "../types/product";
import { User } from "../types/user";
import { readJSON, writeJSON } from "../utils/file.util";

export const getAdminProducts = (_req: Request, res: Response) => {
  const products: Product[] = readJSON(PRODUCTS_PATH);
  res.json(products);
};

export const createAdminProduct = (req: Request, res: Response) => {
  const products: Product[] = readJSON(PRODUCTS_PATH);

  const {
    name,
    description,
    price,
    category,
    available = true,
    image = "",
    stock = 0,
    tags = [],
  } = req.body;

  if (!name || !description || price === undefined || !category) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const newProduct: Product = {
    id: Date.now(),
    name: String(name),
    description: String(description),
    price: Number(price),
    category: String(category),
    available: Boolean(available),
    image: String(image),
    rating: 0,
    stock: Number(stock),
    tags: Array.isArray(tags) ? tags.map(String) : [],
  };

  products.push(newProduct);
  writeJSON(PRODUCTS_PATH, products);

  return res.status(201).json(newProduct);
};

export const updateAdminProduct = (req: Request, res: Response) => {
  const productId = Number(req.params.id);
  const products: Product[] = readJSON(PRODUCTS_PATH);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, description, price, category, available, image, stock, tags } = req.body;

  if (name !== undefined) product.name = String(name);
  if (description !== undefined) product.description = String(description);
  if (price !== undefined) product.price = Number(price);
  if (category !== undefined) product.category = String(category);
  if (available !== undefined) product.available = Boolean(available);
  if (image !== undefined) product.image = String(image);
  if (stock !== undefined) product.stock = Number(stock);
  if (tags !== undefined && Array.isArray(tags)) {
    product.tags = tags.map(String);
  }

  writeJSON(PRODUCTS_PATH, products);
  return res.json(product);
};

export const assignManagerRole = (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const users: User[] = readJSON(USERS_PATH);
  const user = users.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = "manager";
  writeJSON(USERS_PATH, users);
  return res.json(user);
};

export const ownerSessionLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const users: User[] = readJSON(USERS_PATH);
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.role !== "owner" && user.role !== "manager") {
    return res.status(403).json({ message: "Not an admin user" });
  }

  res.cookie("userId", user.id, {
    httpOnly: true,
    maxAge: 30 * 60 * 1000,
    sameSite: "lax",
  });

  if (user.role === "owner") {
    res.cookie("ownerSessionStart", Date.now(), {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
      sameSite: "lax",
    });
  }

  return res.json({ id: user.id, email: user.email, role: user.role });
};
