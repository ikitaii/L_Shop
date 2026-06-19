import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import type { Product } from "../types/Product";
import { ProductCard } from "../components/ProductCard";
import { useI18n } from "../i18n/I18nProvider";
import {
  ProductsCategoryFilter,
  type CategoryFilterValue,
} from "../components/ProductsCategoryFilter";
import "../styles/products.css";

export const ProductsExtended = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState<CategoryFilterValue>("all");
  const { t } = useI18n();

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  const filtered = useMemo(() => {
    const bySearch = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    const byCategory =
      category === "all" ? bySearch : bySearch.filter((p) => p.category === category);

    return [...byCategory].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [products, search, sort, category]);

  return (
    <div className="products products-extended-page">
      <ProductsCategoryFilter value={category} onChange={setCategory} />

      <h1>{t("productsTitle")}</h1>

      <div className="products-controls">
        <input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">{t("sortDefault")}</option>
          <option value="price-asc">{t("sortPriceAsc")}</option>
          <option value="price-desc">{t("sortPriceDesc")}</option>
          <option value="rating">{t("sortRating")}</option>
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
