import express from "express";
import cartRoutes from "./routes/cart.routes";
import usersRoutes from "./routes/users.routes";

const app = express();

app.use(express.json());

app.use("/cart", cartRoutes);
app.use("/api/users", usersRoutes);

app.listen(3000, () => {
  console.log("Server started");
});

