import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<any>(null);

  const loadUser = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/me", {
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
