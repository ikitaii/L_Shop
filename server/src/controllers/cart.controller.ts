import { Request, Response } from "express";
import { readJSON, writeJSON } from "../utils/file.util";

const CART_PATH = "../data/cart.json";

export const getCart = (req: Request, res: Response) => {
  const userId = req.userId!;

  const cart = readJSON(CART_PATH);

  const userCart = cart.filter((item: any) => item.userId === userId);

  res.json(userCart);
};

export const addToCart = (req: Request, res: Response) => {
  const userId = req.userId!;
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "productId required" });
  }

  const cart = readJSON(CART_PATH);

  const existing = cart.find(
    (item: any) =>
      item.productId === productId && item.userId === userId
  );

  if (existing) {
    existing.quantity += quantity || 1;

    writeJSON(CART_PATH, cart);

    return res.json(existing);
  }

  const newItem = {
    id: Date.now(),
    userId,
    productId,
    quantity: quantity || 1,
  };

  cart.push(newItem);

  writeJSON(CART_PATH, cart);

  res.status(201).json(newItem);
};

export const updateCart = (req: Request, res: Response) => {
  const userId = req.userId!;
  const { productId, quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({ message: "quantity required" });
  }

  const cart = readJSON(CART_PATH);

  const item = cart.find(
    (i: any) =>
      i.productId === productId && i.userId === userId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.quantity = quantity;

  writeJSON(CART_PATH, cart);

  res.json(item);
};

export const deleteFromCart = (req: Request, res: Response) => {
  const userId = req.userId!;
  const id = Number(req.params.id);

  const cart = readJSON(CART_PATH);

  const index = cart.findIndex(
    (item: any) => item.id === id && item.userId === userId
  );

  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  cart.splice(index, 1);

  writeJSON(CART_PATH, cart);

  res.json({ message: "Removed from cart" });
};
