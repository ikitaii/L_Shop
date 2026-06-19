import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useI18n } from "../i18n/I18nProvider";
import type { Product } from "../types/Product";
import { EnhancedProductCard } from "../components/EnhancedProductCard";
import { useUser } from "../hooks/useUser";
import "../styles/products.css";
import "../styles/showcase.css";

export const Showcase = () => {
  const { t } = useI18n();
  const { user } = useUser();
  const [feed, setFeed] = useState<Product[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const catalog = await api.getProducts();
    setFeed(catalog);

    if (!user) {
      setRecommended([]);
      return;
    }

    try {
      const rec = await api.getRecommendations();
      setRecommended(Array.isArray(rec.recommended) ? rec.recommended : []);
      if (Array.isArray(rec.feed)) {
        setFeed(rec.feed);
      }
    } catch {
      setRecommended([]);
    }
  }, [user]);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const filteredFeed = useMemo(
    () => feed.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
    [feed, search]
  );

  return (
    <div className="products showcase-page">
      <h1>{t("advancedShowcase")}</h1>
      <div className="products-controls">
        <input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {recommended.length > 0 ? (
        <>
          <h2>{t("recommended")}</h2>
          <div className="products-grid">
            {recommended.slice(0, 4).map((product) => (
              <EnhancedProductCard
                key={`rec-${product.id}`}
                product={product}
                user={user}
                onLiked={load}
              />
            ))}
          </div>
        </>
      ) : null}

      <h2>{t("productsTitle")}</h2>
      <div className="products-grid">
        {filteredFeed.map((product) => (
          <EnhancedProductCard key={product.id} product={product} user={user} onLiked={load} />
        ))}
      </div>
    </div>
  );
};
