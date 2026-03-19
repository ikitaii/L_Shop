import { Request, Response } from "express";
import { readJSON, writeJSON } from "../utils/file.util";
import { Product } from "../types/product";
import path from "path";

const PRODUCTS_PATH = path.join(__dirname, "../data/products.json");
 
export const getProducts = (req: Request, res: Response) => {
  let products: Product[] = readJSON(PRODUCTS_PATH);

  const { search, sort, category, available } = req.query;

  if (search) {
    const s = String(search).toLowerCase();
    products = products.filter((p: Product) =>
      p.name.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s)
    );
  }

  if (category) {
    products = products.filter((p: Product) => p.category === category);
  }

  if (available !== undefined) {
    const isAvailable = available === "true";
    products = products.filter((p: Product) => p.available === isAvailable);
  }

  if (sort === "price_asc") {
    products.sort((a, b) => a.price - b.price);
  }

  if (sort === "price_desc") {
    products.sort((a, b) => b.price - a.price);
  }

  res.json(products);
}; 
export const createProduct = (req: Request, res: Response) => {
  const products: Product[] = readJSON(PRODUCTS_PATH);

  const { name, description, price, category, available } = req.body;

  const newProduct: Product = {
    id: Date.now(),
    name,
    description,
    price: Number(price),
    category,
    available: available === true || available === "true",
  };

  products.push(newProduct);
  writeJSON(PRODUCTS_PATH, products);

  res.status(201).json(newProduct);
}; 
export const deleteProduct = (req: Request, res: Response) => {
  const products: Product[] = readJSON(PRODUCTS_PATH);

  const id = Number(req.params.id);
  const index = products.findIndex((p: Product) => Number(p.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products.splice(index, 1);
  writeJSON(PRODUCTS_PATH, products);

  res.json({ message: "Deleted" });
}; 
export const updateProduct = (req: Request, res: Response) => {
  const products: Product[] = readJSON(PRODUCTS_PATH);

  const id = Number(req.params.id);
  const product = products.find((p: Product) => Number(p.id) === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, description, price, category, available } = req.body;

  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (category !== undefined) product.category = category;

  if (available !== undefined) {
    product.available = available === true || available === "true";
  }

  writeJSON(PRODUCTS_PATH, products);

  res.json(product);
};
