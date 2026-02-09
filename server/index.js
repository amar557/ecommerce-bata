import express from "express";
import mongoose from "mongoose";
import route from "./Routes/api.route.js";
import Categories from "./Routes/categories.route.js";
import cartRoutes from "./Routes/cartRoutes.js";
import authRouter from "./Routes/Auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dynamicNavbar from "./Routes/dynamicNavbar.js";
import { verifyToken } from "./middlewares/verifyToken.mdw.js";
const app = express();

app.use(express.json());
const corsOptions = {
  origin: ["http://localhost:5173", "https://ecommerce-bata.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});


app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/auth", authRouter);
app.use("/api/item", route);
app.use("/api", Categories);
app.use("/api", dynamicNavbar);

app.use("/api/cart",verifyToken, cartRoutes);
mongoose
  .connect(
    // "mongodb://127.0.0.1:27017/mydatabase",
    "mongodb+srv://amarhussain391:9paDhEsS74X28hnt@cluster0.rvzcl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("running");
});
