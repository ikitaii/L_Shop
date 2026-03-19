import { Request, Response } from "express";
import { cart } from "../data/cart";
export const getCart = (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const userCart = cart.filter(item => item.userId === userId);

  res.json(userCart);
};
export const addToCart = (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "productId required" });
  }

  const existing = cart.find(
    item => item.productId === productId && item.userId === userId
  );

  if (existing) {
    existing.quantity += quantity || 1;
    return res.json(existing);
  }

  const newItem = {
    id: Date.now(),
    userId,
    productId,
    quantity: quantity || 1,
  };

  cart.push(newItem);

  res.status(201).json(newItem);
};
export const updateCart = (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { productId, quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({ message: "quantity required" });
  }

  const item = cart.find(
    i => i.productId === productId && i.userId === userId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.quantity = quantity;

  res.json(item);
};
export const deleteFromCart = (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const id = Number(req.params.id);

  const index = cart.findIndex(
    item => item.id === id && item.userId === userId
  );

  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  cart.splice(index, 1);

  res.json({ message: "Removed from cart" });
};
