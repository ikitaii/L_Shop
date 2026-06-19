import { ProductsBanner } from "../components/ProductsBanner";
import { ProductsExtended } from "./ProductsExtended";
import "../styles/products-home.css";

export const ProductsWithBanner = () => {
  return (
    <div className="products-home-shell">
      <ProductsBanner />
      <ProductsExtended />
    </div>
  );
};
