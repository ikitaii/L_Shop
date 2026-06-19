import { useI18n } from "../i18n/I18nProvider";
import "../styles/products-category-filter.css";

export type CategoryFilterValue =
  | "all"
  | "smartphones"
  | "accessories"
  | "laptops"
  | "pods"
  | "tablets";

type Props = {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
};

export const ProductsCategoryFilter = ({ value, onChange }: Props) => {
  const { t } = useI18n();

  const categories: Array<{ value: CategoryFilterValue; label: string }> = [
    { value: "all", label: t("categoryAll") },
    { value: "smartphones", label: t("categoryPhones") },
    { value: "accessories", label: t("categoryAccessories") },
    { value: "laptops", label: t("categoryLaptops") },
    { value: "pods", label: t("categoryHeadphones") },
    { value: "tablets", label: t("categoryTablets") },
  ];

  return (
    <div className="products-category-filter">
      {categories.map((item) => (
        <button
          key={item.value}
          type="button"
          className={item.value === value ? "active" : ""}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
