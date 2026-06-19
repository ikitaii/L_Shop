import "../styles/footer.css";
import { useI18n } from "../i18n/I18nProvider";
import { Link, useLocation } from "react-router-dom";

export const Footer = () => {
  const { t } = useI18n();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <span>{t("footerBrand")}</span>
        <div className="app-footer-right">
          <span>
            © {new Date().getFullYear()} {t("footerRights")}
          </span>
          {isLoginPage ? (
            <Link className="app-footer-admin-link" to="/admin">
              {t("adminLoginLink")}
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  );
};
