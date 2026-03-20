const BASE_URL = "http://localhost:3000";

export const api = {
  get: async <T>(url: string): Promise<T> => {
    const res = await fetch(BASE_URL + url, {
      credentials: "include"
    });
    return res.json();
  },

  post: async <T>(url: string, data: unknown): Promise<T> => {
    const res = await fetch(BASE_URL + url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
