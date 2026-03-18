import express from "express";
import cartRoutes from "./routes/cart.routes"; 

const app = express();

app.use(express.json());
app.use("/cart", cartRoutes); 

app.listen(3000, () => {
  console.log("Server started");
});
