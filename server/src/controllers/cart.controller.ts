import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const cartPath = path.join(__dirname, "../data/cart.json");
const productsPath = path.join(__dirname, "../data/products.json");

const readJSON = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const writeJSON = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const getCart = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId || 1;

    const cart = readJSON(cartPath);
    const products = readJSON(productsPath);

    const userCart = cart
      .filter((item: any) => item.userId === userId)
      .map((item: any) => {
        const product = products.find((p: any) => p.id === item.productId);

        return {
  id: item.id,
  productId: item.productId,
  quantity: item.quantity,
  name: product?.name,
  price: product?.price,
  image: product?.image,  
};
      });

    res.json(userCart);
  } catch (err) {
    res.status(500).json({ message: "Ошибка корзины" });
  }
};

export const addToCart = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId || 1;
    const { productId, quantity } = req.body;
    const qty = quantity || 1;

    if (!productId) {
      return res.status(400).json({ message: "Нет productId" });
    }

    const cart = readJSON(cartPath);
    const products = readJSON(productsPath);  

    const product = products.find((p: any) => p.id === productId);   

    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    const existing = cart.find(
      (item: any) =>
        item.userId === userId && item.productId === productId
    );

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        id: Date.now(),
        userId,
        productId,
        name: product.name,      
        price: product.price,    
        image: product.image,    
        quantity: qty,
      });
    }

    writeJSON(cartPath, cart);

    res.json({ message: "Добавлено" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка добавления" });
  }
};


export const updateCart = (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id); 
    const { quantity } = req.body;

    const cart = readJSON(cartPath);

    const item = cart.find((i: any) => i.id === id);

    if (!item) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    item.quantity = quantity;

    writeJSON(cartPath, cart);

    res.json({ message: "Обновлено" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка обновления" });
  }
};


export const removeFromCart = (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    let cart = readJSON(cartPath);
    cart = cart.filter((item: any) => item.id !== id);

    writeJSON(cartPath, cart);

    res.json({ message: "Удалено" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка удаления" });
  }
};
