import express from "express";
import routes from "./routes";
const app = express();

app.use(express.json()); 
app.get("/", (req, res) => {
  res.send("API работает");
});
app.use("/api", routes);
app.listen(3000, () => {
  console.log("Server started on port 3000");
});