import "../styles/header.css";
import { useUser } from "../hooks/useUser";
import { BASE_URL } from "../config";
import { useI18n } from "../i18n/I18nProvider";
import { Link } from "react-router-dom";

export const Header = () => {
  const { user } = useUser();
  const { t } = useI18n();

  const logout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">{t("navProducts")}</Link>
        <Link to="/showcase">{t("advancedShowcase")}</Link>
        <Link to="/cart">{t("navCart")}</Link>
        {user?.role && user.role !== "user" ? <Link to="/admin">{t("adminPanel")}</Link> : null}
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="navbar-user">
            <span>👤 {user.email}</span>
            <button onClick={logout}>{t("navLogout")}</button>
          </div>
        ) : (
          <Link to="/login">{t("navLogin")}</Link>
        )}
      </div>
    </nav>
  );
};
