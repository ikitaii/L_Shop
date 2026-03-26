const BASE_URL = "http://localhost:3000";

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
};
