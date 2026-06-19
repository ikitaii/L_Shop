import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useI18n } from "../i18n/I18nProvider";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import type { Product } from "../types/Product";
import "../styles/admin.css";

type ProductForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  available: boolean;
  image: string;
  stock: string;
  tags: string;
};

const defaultForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  available: true,
  image: "",
  stock: "",
  tags: "",
};

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const { t } = useI18n();
  const { user } = useUser();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const data = await api.getAdminProducts();
      setProducts(data);
    } catch {
      setError(t("adminAccessDenied"));
    }
  }, [t]);

  useEffect(() => {
    if (user?.role === "owner" || user?.role === "manager") {
      setAuthorized(true);
      load().catch(() => undefined);
    }
  }, [user, load]);

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedId) || null,
    [products, selectedId]
  );

  useEffect(() => {
    if (!selectedProduct) {
      setForm(defaultForm);
      return;
    }

    setForm({
      name: selectedProduct.name,
      description: selectedProduct.description,
      price: String(selectedProduct.price),
      category: selectedProduct.category,
      available: selectedProduct.available,
      image: selectedProduct.image,
      stock: String(selectedProduct.stock),
      tags: (selectedProduct.tags || []).join(", "),
    });
  }, [selectedProduct]);

  const submit = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      available: form.available,
      image: form.image,
      stock: Number(form.stock),
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (selectedId) {
      await api.updateAdminProduct(selectedId, payload);
    } else {
      await api.createAdminProduct(payload);
    }

    setSelectedId(null);
    setForm(defaultForm);
    await load();
  };

  const loginAdmin = async () => {
    try {
      setError("");
      await api.adminSessionLogin(adminEmail, adminPassword);
      setAuthorized(true);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("adminLoginError"));
    }
  };

  if (!authorized) {
    return (
      <div className="admin-page admin-login-page">
        <form
          className="admin-form admin-login-form"
          onSubmit={(e) => {
            e.preventDefault();
            loginAdmin().catch(() => undefined);
          }}
        >
          <h2>{t("adminTitle")}</h2>
          <input
            placeholder={t("adminEmail")}
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder={t("adminPassword")}
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
          <button type="submit" className="admin-login-submit">
            {t("navLogin")}
          </button>
          <button type="button" className="admin-cancel-link" onClick={() => navigate("/")}>
            {t("cancel")}
          </button>
          {error ? <div className="admin-error">{error}</div> : null}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>{t("adminTitle")}</h1>
      {error ? <div className="admin-error">{error}</div> : null}

      <div className="admin-layout">
        <div className="admin-list">
          <button onClick={() => setSelectedId(null)}>{t("createProduct")}</button>
          {products.map((product) => (
            <button key={product.id} onClick={() => setSelectedId(product.id)}>
              {product.name}
            </button>
          ))}
        </div>

        <div className="admin-form">
          <h3>{selectedId ? t("editProduct") : t("createProduct")}</h3>
          <input
            placeholder={t("nameLabel")}
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <textarea
            placeholder={t("descriptionLabel")}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <input
            placeholder={t("priceLabel")}
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
          />
          <input
            placeholder={t("categoryLabel")}
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          />
          <input
            placeholder={t("imagePathLabel")}
            value={form.image}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
          />
          <input
            placeholder={t("stockLabel")}
            value={form.stock}
            onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
          />
          <input
            placeholder={t("tagsLabel")}
            value={form.tags}
            onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
          />
          <label>
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm((prev) => ({ ...prev, available: e.target.checked }))}
            />
            {t("availableLabel")}
          </label>
          <button onClick={submit}>{t("save")}</button>
        </div>
      </div>
    </div>
  );
};
