import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Product } from "../types/Product";
import { ProductCard } from "../components/ProductCard";
import "../styles/products.css";

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  return (
    <div className="products">
      <h1>Товары</h1>

      <div className="products-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};