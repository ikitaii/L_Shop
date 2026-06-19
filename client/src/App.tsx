import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Cart } from "./pages/Cart";
import { Login } from "./pages/Login";
import { Header } from "./components/Header";
import { LocaleBanner } from "./components/LocaleBanner";
import { I18nProvider } from "./i18n/I18nProvider";
import { AdminProducts } from "./pages/AdminProducts";
import { Showcase } from "./pages/Showcase";
import { ProductsWithBanner } from "./pages/ProductsWithBanner";
import { Footer } from "./components/Footer";

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <LocaleBanner />
        <Header />

        <Routes>
          <Route path="/" element={<ProductsWithBanner />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminProducts />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </I18nProvider>
  );
}

export default App;