import { useState } from "react";
import type { Product } from "../types/Product";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

type Props = {
  product: Product;
};

export const ProductCard = ({ product }: Props) => {
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();  

  const handleAdd = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/me", {
        credentials: "include",
      });

      if (!res.ok) {
        alert("Сначала войдите в аккаунт");
        navigate("/login");
        return;
      }

      await api.addToCart(product.id);

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="product-card">
      <img
        src={`http://localhost:3000${product.image}`}
        alt={product.name}
      />

      <div className="product-name">{product.name}</div>

      <div className="product-price">{product.price} ₽</div>

      <div className="product-rating">
        ⭐ {product.rating}
      </div>

      <button
        className={added ? "added" : ""}
        onClick={handleAdd}
        disabled={added}
      >
        {added ? "Добавлено" : "В корзину"}
      </button>
    </div>
  );
};
