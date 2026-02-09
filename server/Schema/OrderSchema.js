import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    quantity: { type: Number, required: true },
    selectedSizeId: { type: String, default: null },
    title: { type: String },
    price: { type: Number },
    discountPrice: { type: Number },
    thumbnailImage: { type: String },
    sizeLabel: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String },
      phone: { type: String },
      email: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    status: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered"],
      default: "placed",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "wallet", "netbanking", "cod"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    totalAmount: { type: Number },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1 });
// orderNumber already has unique: true (index created automatically)
orderSchema.index({ status: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
