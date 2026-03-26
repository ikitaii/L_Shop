import "../styles/header.css";
import { useUser } from "../hooks/useUser";

export const Header = () => {
  const { user, reload } = useUser();

  const logout = async () => {
  console.log("CLICK LOGOUT");

  await fetch("http://localhost:3000/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  window.location.reload();  
};

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/">Товары</a>
        <a href="/cart">Корзина</a>
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="navbar-user">
            <span>👤 {user.email}</span>
            <button onClick={logout}>Выйти</button>
          </div>
        ) : (
          <a href="/login">Войти</a>
        )}
      </div>
    </nav>
  );
};
