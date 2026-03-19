import { Request, Response } from "express";
import { cart } from "../data/cart";

export const getCart = (req: Request, res: Response) => {
  res.json(cart);
};

export const addToCart = (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const newItem = {
    id: Date.now(),
    productId,
    quantity,
  };

  cart.push(newItem);

  res.status(201).json(newItem);
};

export const deleteFromCart = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const index = cart.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  cart.splice(index, 1);

  res.json({ message: "Removed from cart" });
};
