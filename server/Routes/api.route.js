import express from "express";
import {
  deleteItem,
  getAllItems,
  getBestSellers,
  getItem,
  getSuggestedItems,
  listItem,
  updateItem,
  searchItems,
} from "../controller/Categories.js";
import {
  getProductReviews,
  createProductReview,
} from "../controller/reviewController.js";
import { listSchema, validate } from "../validator/list.validate.js";
import { verifyToken } from "../middlewares/verifyToken.mdw.js";

const route = express.Router();

route.post("/listItem", validate(listSchema), listItem);
route.put("/updateItem/:id", updateItem);
route.delete("/deleteItem/:id", deleteItem);
route.get("/items", getAllItems);
route.get("/best-sellers", getBestSellers);
route.get("/search", searchItems);
route.get("/finditem/:id", getItem);
route.get("/suggestions/:id", getSuggestedItems);
route.get("/:productId/reviews", getProductReviews);
route.post("/:productId/reviews", verifyToken, createProductReview);

export default route;
