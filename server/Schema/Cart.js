import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // User model is registered as "user" (lowercase)
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item", // ✅ your Item model name
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    selectedSizeId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["in_cart", "checked_out"],
      default: "in_cart",
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
