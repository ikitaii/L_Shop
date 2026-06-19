import { useEffect, useState } from "react";
import type { User } from "../types/User";
import { BASE_URL } from "../config";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  const loadUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return { user, reload: loadUser };
};
