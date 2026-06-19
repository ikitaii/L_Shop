import { Request, Response } from "express";
import fs from "fs";
import { CART_PATH, PRODUCTS_PATH } from "../constants/paths";

const readJSON = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const writeJSON = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const getCart = (req: Request, res: Response) => {
  try {
    const userId = Number(req.cookies?.userId);
    if (!userId) {
      return res.json([]);
    }

    const cart = readJSON(CART_PATH);
    const products = readJSON(PRODUCTS_PATH);

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
    const userId = Number(req.cookies?.userId);
    if (!userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    const { productId, quantity } = req.body;
    const qty = quantity || 1;

    if (!productId) {
      return res.status(400).json({ message: "Нет productId" });
    }

    const cart = readJSON(CART_PATH);
    const products = readJSON(PRODUCTS_PATH);  

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

    writeJSON(CART_PATH, cart);

    res.json({ message: "Добавлено" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка добавления" });
  }
};


export const updateCart = (req: Request, res: Response) => {
  try {
    const userId = Number(req.cookies?.userId);
    if (!userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const id = Number(req.params.id); 
    const { quantity } = req.body;

    const cart = readJSON(CART_PATH);

    const item = cart.find((i: any) => i.id === id && i.userId === userId);

    if (!item) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    item.quantity = quantity;

    writeJSON(CART_PATH, cart);

    res.json({ message: "Обновлено" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка обновления" });
  }
};


export const removeFromCart = (req: Request, res: Response) => {
  try {
    const userId = Number(req.cookies?.userId);
    if (!userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const id = Number(req.params.id);

    let cart = readJSON(CART_PATH);
    cart = cart.filter((item: any) => !(item.id === id && item.userId === userId));

    writeJSON(CART_PATH, cart);

    res.json({ message: "Удалено" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка удаления" });
  }
};
