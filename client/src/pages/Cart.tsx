import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { CartItem as CartItemType } from "../types/CartItem";
import { CartItem } from "../components/CartItem";
import "../styles/cart.css";

export const Cart = () => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [open, setOpen] = useState(false); 

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

        <button onClick={() => setOpen(true)} className="order-btn">
          Оформить
        </button>
      </div>

      {open && (
        <div className="modal">
          <div className="modal-content">
            <h2>Оформление заказа</h2>

            <p>Итого: {total} ₽</p>

            <div className="modal-actions">
              <button onClick={() => setOpen(false)}>
                Отмена
              </button>

              <button
                onClick={() => {
                  alert("Заказ оформлен ");
                  setOpen(false);
                }}
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
