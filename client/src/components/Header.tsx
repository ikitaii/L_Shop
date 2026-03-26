import { Link } from "react-router-dom";
import "../styles/header.css";

export const Header = () => {
  return (
    <nav>
      <Link to="/">Товары</Link>
      <Link to="/cart">Корзина</Link>
      <Link to="/login">Войти</Link>
    </nav>
  );
};