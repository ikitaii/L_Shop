import { useState } from "react";
import "../styles/auth.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Успешный вход");
      } else {
        alert(data.message || "Ошибка входа");
      }
    } catch {
      alert("Ошибка запроса");
    }
  };

  const handleRegister = async () => {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Регистрация успешна");
      setOpen(false);
    } else {
      alert(data.message);
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

        <p className="register-link" onClick={() => setOpen(true)}>
          Зарегистрироваться
        </p>
      </form>

      {open && (
        <div className="modal">
          <div className="modal-content">
            <h3>Регистрация</h3>

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

            <div className="modal-actions">
              <button onClick={() => setOpen(false)}>Отмена</button>
              <button onClick={handleRegister}>Создать</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
