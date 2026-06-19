import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import usersRoutes from "./routes/users.routes";
import cartRoutes from "./routes/cart.routes";
import authRoutes from "./routes/auth.routes";
import productsRoutes from "./routes/products.routes";
import mainRouter from "./routes";
import localeRoutes from "./routes/locale.routes";
import recommendationsRoutes from "./routes/recommendations.routes";
import adminRoutes from "./routes/admin.routes";
import reviewsRoutes from "./routes/reviews.routes";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "../public/images")));

app.use("/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/cart", cartRoutes);
app.use("/auth", authRoutes);
app.use("/locale", localeRoutes);
app.use("/recommendations", recommendationsRoutes);
app.use("/admin", adminRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/", mainRouter);

export default app;

if (require.main === module) {
  app.listen(3000, () => {
    console.log(" Server started on http://localhost:3000");
  });
}