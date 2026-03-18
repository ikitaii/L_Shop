import { Request, Response } from "express";
import { products } from "../data/products";
export const getProducts = (req: Request, res: Response) => {
  res.json(products);
};
export const createProduct = (req: Request, res: Response) => {
  const { name, price } = req.body;

  const newProduct = {
    id: Date.now(),
    name,
    price,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
};
export const deleteProduct = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }
  products.splice(index, 1);

  res.json({ message: "Deleted" });
};
export const updateProduct = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, price } = req.body;

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;

  res.json(product);
};