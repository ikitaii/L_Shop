import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { BASE_URL } from "../config";
import type { Product } from "../types/Product";
import { useI18n } from "../i18n/I18nProvider";
import { ReviewsBlock } from "./ReviewsBlock";
import type { User } from "../types/User";

type Props = {
  product: Product;
  user: User | null;
  onLiked: () => void;
};

export const EnhancedProductCard = ({ product, user, onLiked }: Props) => {
  const [added, setAdded] = useState(false);
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api.addToCart(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch {
      navigate("/login");
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    await api.likeProduct(product.id);
    onLiked();
  };

  return (
    <div className="product-card">
      <img src={`${BASE_URL}${product.image}`} alt={product.name} />
      <div className="product-name">{product.name}</div>
      <div className="product-price">{product.price} ₽</div>
      <div className="product-rating">⭐ {product.rating}</div>
      <button onClick={handleLike}>{t("like")}</button>
      <button className={added ? "added" : ""} onClick={handleAdd} disabled={added}>
        {added ? t("addedToCart") : t("addToCart")}
      </button>
      <ReviewsBlock productId={product.id} canReview={Boolean(user)} />
    </div>
  );
};
