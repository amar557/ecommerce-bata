import express from "express";
import {
  addToCart,
  getCartItems,
  removeFromCart,
  checkoutCart,
  getAdminOrders,
} from "../controller/cartController.js";
import { verifyToken } from "../middlewares/verifyToken.mdw.js";
import { verifyAdmin } from "../middlewares/VerifyAdmin.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/items", getCartItems);
router.delete("/:id", removeFromCart);
router.post("/checkout", checkoutCart);
router.post("/admin/orders",verifyToken,verifyAdmin, getAdminOrders);

export default router;
