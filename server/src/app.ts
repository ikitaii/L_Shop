/// <reference path="./types/express.d.ts" />
import express from "express";
import productsRoutes from "./routes/products.routes";
import usersRoutes from "./routes/users.routes";
import cartRoutes from "./routes/cart.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());

app.use("/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/cart", cartRoutes);
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

