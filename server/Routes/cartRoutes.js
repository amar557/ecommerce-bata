import express from "express";
import {
  addToCart,
  getCartItems,
  removeFromCart,
  checkoutCart,
  getOrderById,
  getUserOrders,
  getAdminOrders,
  updateOrderStatus,
} from "../controller/cartController.js";
import { verifyToken } from "../middlewares/verifyToken.mdw.js";
import { verifyAdmin } from "../middlewares/VerifyAdmin.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/items", getCartItems);
router.delete("/:id", removeFromCart);
router.post("/checkout", checkoutCart);
router.get("/orders", getUserOrders);
router.get("/order/:orderId", getOrderById);
router.get("/admin/orders", verifyToken, verifyAdmin, getAdminOrders);
router.put("/admin/order/:orderId/status", verifyToken, verifyAdmin, updateOrderStatus);

export default router;
