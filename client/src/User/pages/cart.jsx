import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  User,
  Search,
  Heart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Shield,
  Truck,
  X,
  ShoppingBag,
} from "lucide-react";
import { useNavigationController } from "../../constants/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  fetchCart,
  removeItemFromCart,
} from "../../Admin/Redux/Slices/cartSlice";
import { toast } from "react-toastify";

// Header Component

// Cart Item Component
const CartItem = ({
  item,
  updateQuantity,
  removeItem,
  quantity,
  cart: cartItem,
}) => {
  const hasDiscount = item.discountPrice < item.price;
  const itemPrice = hasDiscount ? item.discountPrice : item.price;
  const itemTotal = itemPrice * quantity;
  const selectedSizeObj = item?.sizes && cartItem?.selectedSizeId
    ? item.sizes.find((s) => String(s._id) === String(cartItem.selectedSizeId))
    : null;
  const sizeLabel = selectedSizeObj ? selectedSizeObj.size : (cartItem?.selectedSizeId ? "—" : "—");
  const stock = selectedSizeObj != null ? selectedSizeObj.stock : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.thumbnailImage}
          alt={item.title}
          className="w-full sm:w-32 h-32 object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase">
              {item.brandId.brand}
            </p>
            <h3 className="text-lg font-semibold text-gray-900">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {item.categoryId.category}
            </p>
          </div>
          <button
            onClick={() => removeItem(cartItem._id)}
            className="p-2 hover:bg-red-50 rounded-full transition text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Color and Size */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Color:</span>
            <div
              className="w-5 h-5 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: item.color }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Size:</span>
            <span className="font-semibold">{sizeLabel}</span>
          </div>
        </div>

        {/* Price and Quantity */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            {hasDiscount ? (
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">
                  ₹{itemPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{item.price}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ₹{itemPrice}
              </span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <button
                onClick={() =>
                  updateQuantity(item._id, Math.max(1, quantity - 1), cartItem?.selectedSizeId)
                }
                className="p-2 hover:bg-gray-100 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, quantity + 1, cartItem?.selectedSizeId)}
                className="p-2 hover:bg-gray-100 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-xl font-bold text-gray-900">₹{itemTotal}</p>
            </div>
          </div>
        </div>

        {/* Stock Status */}
        {stock != null && stock < 5 && stock > 0 && (
          <p className="text-sm text-orange-600 font-semibold">
            Only {stock} left in stock for this size!
          </p>
        )}
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({
  cartItems,
  couponCode,
  setCouponCode,
  applyCoupon,
  discount,
  navigateTo,
}) => {
  const subtotal = cartItems.reduce((sum, cartItem) => {
    let item= cartItem?.productId
    const price = item.discountPrice < item.price ? item.discountPrice : item.price;
    return sum + price * cartItem.quantity;
  }, 0);
  // const {navigateTo}=useNavigationController()

  const shipping = subtotal > 999 ? 0 : 99;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount + shipping;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Coupon Code */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Have a coupon code?
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600"
          />
          <button
            onClick={applyCoupon}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition font-semibold"
          >
            Apply
          </button>
        </div>
        {discount > 0 && (
          <p className="text-sm text-green-600 mt-2 font-semibold">
            ✓ Coupon applied! {discount}% off
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6 pb-6 border-b">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal ({cartItems.length} items)</span>
          <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({discount}%)</span>
            <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `₹${shipping}`
            )}
          </span>
        </div>

        {subtotal < 999 && shipping > 0 && (
          <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
            Add ₹{(999 - subtotal).toFixed(2)} more for FREE shipping!
          </p>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-6">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>

      {/* Checkout Button */}
      <button
        className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center space-x-2 mb-4"
        onClick={() => navigateTo("/checkout")}
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-400 transition">
        Continue Shopping
      </button>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t space-y-3">
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <Shield className="w-5 h-5 text-green-600" />
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <Truck className="w-5 h-5 text-blue-600" />
          <span>Free shipping on orders above ₹999</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <Tag className="w-5 h-5 text-red-600" />
          <span>Best price guaranteed</span>
        </div>
      </div>
    </div>
  );
};

// Empty Cart Component
const EmptyCart = () => {
  const { navigateTo}=useNavigationController()
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added anything to your cart yet. Start shopping
          to fill it up!
        </p>
        <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition" onClick={()=>navigateTo('/products')}>
          Start Shopping
        </button>
      </div>
    </div>
  );
};

// Recommended Products Component
const RecommendedProducts = () => {
  const recommendations = [
    {
      id: 1,
      title: "Casual Loafers",
      brand: "Bata",
      price: 3999,
      image:
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Sports Shoes",
      brand: "Nike",
      price: 5999,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      title: "Running Sneakers",
      brand: "Adidas",
      price: 4999,
      image:
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      title: "Formal Shoes",
      brand: "Bata",
      price: 4499,
      image:
        "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=400&fit=crop",
    },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition"
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  ₹{product.price}
                </span>
                <button className="text-sm text-red-600 font-semibold hover:text-red-700">
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Cart() {
  const dispatch = useDispatch();
  const { items, error, loading } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const {navigateTo}=useNavigationController()
  // Fetch cart on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const { user } = useSelector((state) => state.auth);
  
  const updateQuantity = async (cartItemId, newQuantity, selectedSizeId) => {
    // Check if user is logged in
    if (!user || !user.name) {
      toast.warning("You are not logged in. Please login to update cart items.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    if (newQuantity < 1) return;

    try {
      await dispatch(addItemToCart({
        productId: cartItemId,
        quantity: newQuantity,
        ...(selectedSizeId != null && selectedSizeId !== "" && { selectedSizeId }),
      })).unwrap();
      toast.success("Cart updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Failed to update cart. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const removeItem = async (cartItemId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        await dispatch(removeItemFromCart({ cartItemId })).unwrap();
        toast.success("Item removed from cart successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        toast.error("Failed to remove item. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const applyCoupon = () => {
    const validCoupons = { SAVE10: 10, SAVE20: 20, WELCOME15: 15 };
    if (validCoupons[couponCode]) {
      setDiscount(validCoupons[couponCode]);
      toast.success(`Coupon "${couponCode}" applied! ${validCoupons[couponCode]}% discount.`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (couponCode) {
      toast.error("Invalid coupon code. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setDiscount(0);
    }
  };

  const totalItems = items?.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 animate-pulse">
        Loading your cart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load cart: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            <a href="/" className="hover:text-red-600">
              Home
            </a>{" "}
            /<span className="text-gray-900 font-semibold"> Shopping Cart</span>
          </p>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {!items || items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items?.length > 0 &&
                items.map((cartItem) => (
                  <CartItem
                    key={cartItem._id}
                    cart={cartItem}
                    item={cartItem?.productId}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                    quantity={cartItem?.quantity}
                  />
                ))}

              {/* Cart Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-lg shadow-md p-4">
                <button className="text-gray-700 font-semibold hover:text-red-600 transition">
                  ← Continue Shopping
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to clear your cart?"
                      )
                    ) {
                      items.forEach((i) =>
                        dispatch(removeItemFromCart({ cartItemId: i._id }))
                      );
                    }
                  }}
                  className="text-red-600 font-semibold hover:text-red-700 transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <OrderSummary
                cartItems={items}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                applyCoupon={applyCoupon}
                discount={discount}
                navigateTo={navigateTo}
              />
            </div>
          </div>
        )}

        {/* Recommended Products */}
        {items?.length > 0 && <RecommendedProducts />}
      </div>
    </div>
  );
}
