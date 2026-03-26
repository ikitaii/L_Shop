import type { CartItem as CartItemType } from "../types/CartItem";

type Props = {
  item: CartItemType;
  onChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
};
export const CartItem = ({ item, onChange, onRemove }: Props) => {
  console.log(item);
  return (
    <div className="cart-item">
  <img
    src={
      item.image
        ? `http://localhost:3000${item.image}`
        : "https://via.placeholder.com/150"
    }
  />

  <div className="cart-info">
    <h3>{item.name}</h3>
    <p>{item.price} ₽</p>

    <div className="quantity-controls">
      <button
        onClick={() => {
          if (item.quantity <= 1) {
            onRemove(item.id);
          } else {
            onChange(item.id, item.quantity - 1);
          }
        }}
      >
        -
      </button>

      <span>{item.quantity}</span>

      <button onClick={() => onChange(item.id, item.quantity + 1)}>
        +
      </button>
    </div>

    <p>Сумма: {item.price * item.quantity}</p>
  </div> 
  <button
    className="remove-btn"
    onClick={() => onRemove(item.id)}
  >
    Удалить
  </button>
</div>

    
  );
};