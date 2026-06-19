import { useRef } from "react";
import "../styles/products-banner.css";

const bannerImages = [
  "/images/banners/Банер Gadgets.png",
  "/images/banners/Банер AirPods.png",
  "/images/banners/Банер Iphones.png",
  "/images/banners/Банер микс.png",
];

export const ProductsBanner = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollBanners = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const offset = direction === "left" ? -420 : 420;
    track.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="products-banner">
      <button
        className="products-banner-nav products-banner-nav-left"
        onClick={() => scrollBanners("left")}
        aria-label="Scroll banners left"
      >
        {"<"}
      </button>

      <div ref={trackRef} className="products-banner-track">
        {bannerImages.map((imagePath) => (
          <div key={imagePath} className="products-banner-item">
            <img src={`http://localhost:3000${imagePath}`} alt="banner" />
          </div>
        ))}
      </div>

      <button
        className="products-banner-nav products-banner-nav-right"
        onClick={() => scrollBanners("right")}
        aria-label="Scroll banners right"
      >
        {">"}
      </button>
    </section>
  );
};
