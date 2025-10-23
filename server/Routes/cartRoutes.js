import express from "express";
import {
  addToCart,
  getCartItems,
  removeFromCart,
  checkoutCart,
} from "../controller/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/items", getCartItems);
router.delete("/:id", removeFromCart);
router.post("/checkout", checkoutCart);

export default router;
