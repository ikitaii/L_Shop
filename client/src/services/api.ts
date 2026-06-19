import { BASE_URL } from "../config";

export const api = { 
  getProducts: async () => {
    const res = await fetch(`${BASE_URL}/products`);

    if (!res.ok) {
      const text = await res.text();
      console.error("Ошибка getProducts:", text);
      throw new Error("Ошибка загрузки товаров");
    }

    return res.json();
  }, 
  getCart: async () => {
    const res = await fetch(`${BASE_URL}/cart`, {
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Ошибка getCart:", text);
      throw new Error("Не авторизован");
    }

    return res.json();
  }, 
  addToCart: async (productId: number) => {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Ошибка addToCart:", text);
      throw new Error("Ошибка добавления");
    }

    return res.json();
  },
 
  updateCart: async (id: number, quantity: number) => {
    const res = await fetch(`${BASE_URL}/cart/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ quantity }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Ошибка updateCart:", text);
      throw new Error("Ошибка обновления");
    }
  }, 
  deleteFromCart: async (id: number) => {
    const res = await fetch(`${BASE_URL}/cart/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Ошибка deleteFromCart:", text);
      throw new Error("Ошибка удаления");
    }
  },

  getLocale: async () => {
    const res = await fetch(`${BASE_URL}/locale`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Locale request failed");
    }
    return res.json();
  },

  detectLocale: async (country?: string) => {
    const query = country ? `?country=${encodeURIComponent(country)}` : "";
    const res = await fetch(`${BASE_URL}/locale/detect${query}`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Locale detect failed");
    }
    return res.json();
  },

  setLocale: async (locale: "ru" | "be") => {
    const res = await fetch(`${BASE_URL}/locale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ locale }),
    });
    if (!res.ok) {
      throw new Error("Locale set failed");
    }
    return res.json();
  },

  likeProduct: async (productId: number) => {
    const res = await fetch(`${BASE_URL}/recommendations/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) {
      throw new Error("Like failed");
    }
    return res.json();
  },

  getRecommendations: async () => {
    const res = await fetch(`${BASE_URL}/recommendations`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Recommendations failed");
    }
    return res.json();
  },

  getProductReviews: async (productId: number) => {
    const res = await fetch(`${BASE_URL}/reviews/${productId}`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Reviews load failed");
    }
    return res.json();
  },

  createReview: async (payload: { productId: number; rating: number; comment: string }) => {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Review create failed");
    }
    return res.json();
  },

  getAdminProducts: async () => {
    const res = await fetch(`${BASE_URL}/admin/products`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Admin access denied");
    }
    return res.json();
  },

  createAdminProduct: async (payload: {
    name: string;
    description: string;
    price: number;
    category: string;
    available: boolean;
    image: string;
    stock: number;
    tags: string[];
  }) => {
    const res = await fetch(`${BASE_URL}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Admin create failed");
    }
    return res.json();
  },

  updateAdminProduct: async (
    id: number,
    payload: {
      name: string;
      description: string;
      price: number;
      category: string;
      available: boolean;
      image: string;
      stock: number;
      tags: string[];
    }
  ) => {
    const res = await fetch(`${BASE_URL}/admin/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Admin update failed");
    }
    return res.json();
  },

  adminSessionLogin: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/admin/session-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Admin login failed");
    }
    return res.json();
  },
};
