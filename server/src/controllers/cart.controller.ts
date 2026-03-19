import { Request, Response } from "express";
import { cart } from "../data/cart";
import { readJSON } from "../utils/file.util";

const PRODUCTS_PATH = "../data/products.json";

export const getCart = (req: Request, res: Response) => {
  const userId = req.userId!;

  const userCart = cart.filter(item => item.userId === userId);

  res.json(userCart);
};

export const addToCart = (req: Request, res: Response) => {
  const userId = req.userId!;
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "productId required" });
  }

  if (quantity && quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity" });
  } 
  const products = readJSON(PRODUCTS_PATH);
  const productExists = products.find((p: any) => p.id === productId);

  if (!productExists) {
    return res.status(404).json({ message: "Product not found" });
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
  const userId = req.userId!;
  const { productId, quantity } = req.body;

  if (quantity === undefined || quantity < 1) {
    return res.status(400).json({ message: "quantity must be >= 1" });
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
  const userId = req.userId!;
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
export const clearCart = (req: Request, res: Response) => {
  const userId = req.userId!;

  for (let i = cart.length - 1; i >= 0; i--) {
    if (cart[i].userId === userId) {
      cart.splice(i, 1);
    }
  }

  res.json({ message: "Cart cleared" });
};
