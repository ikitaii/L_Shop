import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Product } from "../types/Product";
import { ProductCard } from "../components/ProductCard";
import "../styles/products.css";

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  const filtered = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="products">
      <h1>Товары</h1>

      <div className="products-controls">
        <input
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Без сортировки</option>
          <option value="price-asc">Цена ↑</option>
          <option value="price-desc">Цена ↓</option>
          <option value="rating">Рейтинг</option>
        </select>
      </div>

      <div className="products-grid">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};
