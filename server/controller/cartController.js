import Cart from "../Schema/Cart.js";
import Order from "../Schema/OrderSchema.js";

export const addToCart = async (req, res) => {
  let userId = req?.user?._id;
  try {
    const { productId, quantity, selectedSizeId } = req.body;
    const sizeId = selectedSizeId != null && selectedSizeId !== "" ? String(selectedSizeId) : null;
    const query = { userId, productId, status: "in_cart" };
    if (sizeId != null) {
      query.selectedSizeId = sizeId;
    } else {
      query.$or = [{ selectedSizeId: null }, { selectedSizeId: "" }, { selectedSizeId: { $exists: false } }];
    }

    const existing = await Cart.findOne(query);
    if (existing) {
      if (quantity === "up") {
        existing.quantity += 1;
      } else {
        existing.quantity = Number(quantity) || 1;
      }
      await existing.save();
      return res.status(200).json({ msg: "Cart updated", cart: existing });
    }

    const newCartItem = await Cart.create({
      userId,
      productId,
      quantity: Number(quantity) || 1,
      selectedSizeId: sizeId,
    });
    res.status(201).json({ msg: "Item added to cart", cart: newCartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res
      .status(500)
      .json({ msg: "Failed to add to cart", error: error.message });
  }
};

// 📦 Get all items in cart for a user
export const getCartItems = async (req, res) => {
  try {
    let userId = req?.user?._id;
    const cartItems = await Cart.find({ userId, status: "in_cart" }).populate(
      "productId"
    );

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ msg: "Failed to fetch cart", error: error.message });
  }
};

// ❌ Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.status(200).json({ msg: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item:", error);
    res
      .status(500)
      .json({ msg: "Failed to remove item", error: error.message });
  }
};

// ✅ Place order: create Order from cart, then mark cart as checked_out
export const checkoutCart = async (req, res) => {
  try {
    const userId = req?.user?._id;
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const cartItems = await Cart.find({ userId, status: "in_cart" }).populate("productId");
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    const shippingAddress = req.body?.shippingAddress || {};
    const paymentMethod = req.body?.paymentMethod || "cod";
    const paymentStatus = paymentMethod === "cod" ? "unpaid" : "paid";
    const orderNumber = "BATA-" + Date.now();

    const orderItems = cartItems.map((item) => {
      const product = item.productId;
      const price = product?.discountPrice < product?.price ? product.discountPrice : product?.price;
      const sizeObj = product?.sizes && item.selectedSizeId
        ? product.sizes.find((s) => String(s._id) === String(item.selectedSizeId))
        : null;
      return {
        productId: product?._id,
        quantity: item.quantity,
        selectedSizeId: item.selectedSizeId,
        title: product?.title,
        price: product?.price,
        discountPrice: product?.discountPrice,
        thumbnailImage: product?.thumbnailImage,
        sizeLabel: sizeObj ? sizeObj.size : null,
      };
    });

    const totalAmount = orderItems.reduce((sum, it) => {
      const p = it.discountPrice != null && it.discountPrice < it.price ? it.discountPrice : it.price;
      return sum + p * it.quantity;
    }, 0);

    const order = await Order.create({
      userId,
      orderNumber,
      items: orderItems,
      shippingAddress,
      status: "placed",
      paymentMethod,
      paymentStatus,
      totalAmount,
    });

    await Cart.updateMany(
      { userId, status: "in_cart" },
      { status: "checked_out" }
    );

    res.status(201).json({
      msg: "Order placed successfully",
      orderId: order._id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ msg: "Checkout failed", error: error.message });
  }
};

// Get order by ID (own orders only)
export const getOrderById = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ msg: "Failed to fetch order", error: error.message });
  }
};

// Get all orders for logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req?.user?._id;
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ msg: "Failed to fetch orders", error: error.message });
  }
};

// Get all orders for admin (with user info populated)
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ msg: "Failed to fetch orders", error: error.message });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const validStatuses = ["placed", "confirmed", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("userId", "name email");
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(200).json({ msg: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ msg: "Failed to update order status", error: error.message });
  }
};
