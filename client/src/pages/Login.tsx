import { useState } from "react";
import "../styles/auth.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (res.ok) {
        alert("Успешный вход");
      } else {
        alert(data.message || "Ошибка входа");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка запроса");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Вход</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Войти</button>
      </form>
    </div>
  );
};
