import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { CartItem as CartItemType } from "../types/CartItem";
import { CartItem } from "../components/CartItem";
import "../styles/cart.css";

export const Cart = () => {
  const [cart, setCart] = useState<CartItemType[]>([]);

  const load = () => {
  api.getCart().then((data) => {
    if (Array.isArray(data)) {
      setCart(data);
    } else {
      setCart([]);
    }
  });
};

  useEffect(() => {
    load();
  }, []);

  const change = async (id: number, quantity: number) => {
  await api.updateCart(id, quantity);

  const updatedCart = await api.getCart();  
  setCart(updatedCart);
};

  const remove = async (id: number) => {
    await api.deleteFromCart(id);
    load();
  };

  const total = cart.reduce((sum, item) => {
  return sum + item.price * item.quantity;
}, 0);
  return (
    <div className="cart">
      <h1>Корзина</h1>

      {cart.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onChange={change}
          onRemove={remove}
        />
      ))}
      
      <div className="cart-footer">
  <div>Итого: {total} ₽</div>
  <button className="order-btn">Оформить</button>
</div>
    </div>
  );
};