require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./db");

const userRouter = require("./routes/userRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const foodRouter = require("./routes/foodRoutes");
const orderRouter = require("./routes/FoodOrderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 999;

app.use(cors());
app.use(express.json());

connectToDB();

app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/foods", foodRouter);
app.use("/api/orders", orderRouter);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("API listening on http://localhost:" + PORT);
});

console.log("JWT_SECRET=", process.env.JWT_SECRET);
console.log("REFRESH_SECRET=", process.env.REFRESH_SECRET);
