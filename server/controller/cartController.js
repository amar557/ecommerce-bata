import Cart from "../Schema/Cart.js";

// 🛒 Add to cart
export const addToCart = async (req, res) => {
  console.log(req.user);
  let userId = req?.user?._id;
  try {
    console.log(req.body)
    const { productId, quantity = 1 } = req.body;
    // check if item already in cart
    const existing = await Cart.findOne({
      userId,
      productId,
      status: "in_cart",
    });
    if (existing) {
      existing.quantity = quantity;
      await existing.save();
      return res.status(200).json({ msg: "Cart updated", cart: existing });
    }

    const newCartItem = await Cart.create({ userId, productId, quantity });
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
    console.log(req.user);
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

// ✅ Checkout (remove all cart items for a user)
export const checkoutCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // mark all user's cart items as checked out
    await Cart.updateMany(
      { userId, status: "in_cart" },
      { status: "checked_out" }
    );

    res.status(200).json({ msg: "Checkout successful, cart cleared" });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ msg: "Checkout failed", error: error.message });
  }
};
