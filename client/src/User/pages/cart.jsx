import React, { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Shield,
  Truck,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useNavigationController } from "../../constants/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  fetchCart,
  removeItemFromCart,
  updateCartItemQuantityLocal,
} from "../../Admin/Redux/Slices/cartSlice";
import { toast } from "react-toastify";
import LoadingIndicator from "../../components/LoadingIndicator";
import axiosInstance from "../../constants/axiosInstance";
import { ProductCard } from "./products";

// Cart Item Component
const CartItem = ({
  item,
  updateQuantity,
  removeItem,
  quantity,
  cart: cartItem,
  updating = false,
}) => {
  const hasDiscount = item?.offer;
  const itemPrice = hasDiscount ? item.discountPrice : item.price;
  const itemTotal = itemPrice * quantity;
  const selectedSizeObj = item?.sizes && cartItem?.selectedSizeId
    ? item.sizes.find((s) => String(s._id) === String(cartItem.selectedSizeId))
    : null;
  const sizeLabel = selectedSizeObj ? selectedSizeObj.size : (cartItem?.selectedSizeId ? "—" : "—");
  const stock = selectedSizeObj != null ? selectedSizeObj.stock : null;

  return (
    <div className="relative bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4 overflow-hidden">
      {updating && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-white/75 backdrop-blur-[1px] cursor-wait">
          <Loader2 className="w-8 h-8 text-deepRed-600 animate-spin" />
          <p className="text-sm font-medium text-gray-700">Updating...</p>
        </div>
      )}

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
            type="button"
            disabled={updating}
            onClick={() => removeItem(cartItem._id)}
            className="p-2 hover:bg-deepRed-50 rounded-full transition text-gray-400 hover:text-deepRed-600 disabled:opacity-40 disabled:cursor-not-allowed"
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
                  PKR {itemPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  PKR {item.price}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                PKR {itemPrice}
              </span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <button
                type="button"
                disabled={updating || quantity <= 1}
                onClick={() =>
                  updateQuantity(
                    item._id,
                    Math.max(1, quantity - 1),
                    cartItem?.selectedSizeId,
                    cartItem?._id
                  )
                }
                className="p-2 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-semibold">{quantity}</span>
              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  updateQuantity(
                    item._id,
                    quantity + 1,
                    cartItem?.selectedSizeId,
                    cartItem?._id
                  )
                }
                className="p-2 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-xl font-bold text-gray-900">PKR {itemTotal}</p>
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
    const price = item.discountPrice > item.price ? item.discountPrice : item.price;
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
            className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-deepRed-600"
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
          <span className="font-semibold">PKR {subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({discount}%)</span>
            <span className="font-semibold">-PKR {discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `PKR ${shipping}`
            )}
          </span>
        </div>

        {subtotal < 999 && shipping > 0 && (
          <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
            Add PKR {(999 - subtotal).toFixed(2)} more for FREE shipping!
          </p>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-6">
        <span>Total</span>
        <span>PKR {total.toFixed(2)}</span>
      </div>

      {/* Checkout Button */}
      <button
        className="w-full bg-deepRed-600 text-white py-4 rounded-lg font-bold hover:bg-deepRed-700 transition flex items-center justify-center space-x-2 mb-4"
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
          <span>Free shipping on orders above PKR 999</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <Tag className="w-5 h-5 text-deepRed-600" />
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
        <button className="bg-deepRed-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-deepRed-700 transition" onClick={()=>navigateTo('/products')}>
          Start Shopping
        </button>
      </div>
    </div>
  );
};

// Recommended Products — based on categories/gender of items already in cart
const RecommendedProducts = ({ cartItems = [] }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const cartProductIds = useMemo(() => {
    const ids = (cartItems || [])
      .map((item) => String(item?.productId?._id || item?.productId || ""))
      .filter(Boolean);
    return [...new Set(ids)];
  }, [cartItems]);

  const seedKey = cartProductIds.join(",");

  useEffect(() => {
    if (!cartProductIds.length) {
      setProducts([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // Use up to 3 cart products so suggestions reflect mixed cart contents
        const seeds = cartProductIds.slice(0, 3);
        const results = await Promise.all(
          seeds.map((id) =>
            axiosInstance
              .get(`/api/item/suggestions/${id}`)
              .then((res) =>
                Array.isArray(res.data?.data) ? res.data.data : []
              )
              .catch(() => [])
          )
        );

        const cartSet = new Set(cartProductIds);
        const merged = [];
        const seen = new Set();

        for (const list of results) {
          for (const product of list) {
            const pid = String(product?._id || "");
            if (!pid || cartSet.has(pid) || seen.has(pid)) continue;
            seen.add(pid);
            merged.push(product);
            if (merged.length >= 4) break;
          }
          if (merged.length >= 4) break;
        }

        if (!cancelled) setProducts(merged);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [seedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          You May Also Like
        </h2>
        <div className="flex justify-center py-10">
          <LoadingIndicator size="sm" message="Finding similar products..." />
        </div>
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
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
  const [updatingIds, setUpdatingIds] = useState({});

  const { navigateTo } = useNavigationController();
  // Fetch cart on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const { user } = useSelector((state) => state.auth);

  const setItemUpdating = (cartRowId, value) => {
    if (!cartRowId) return;
    setUpdatingIds((prev) => {
      const next = { ...prev };
      if (value) next[cartRowId] = true;
      else delete next[cartRowId];
      return next;
    });
  };

  const updateQuantity = async (
    productId,
    newQuantity,
    selectedSizeId,
    cartRowId
  ) => {
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

    const cartRow =
      (cartRowId && items?.find((i) => String(i._id) === String(cartRowId))) ||
      items?.find(
        (i) =>
          String(i.productId?._id || i.productId) === String(productId) &&
          String(i.selectedSizeId || "") === String(selectedSizeId || "")
      );

    const rowId = cartRow?._id || cartRowId;
    if (rowId && updatingIds[rowId]) return;

    const previousQuantity = cartRow?.quantity;
    if (rowId) {
      setItemUpdating(rowId, true);
      dispatch(
        updateCartItemQuantityLocal({
          cartItemId: rowId,
          quantity: newQuantity,
        })
      );
    }

    try {
      await dispatch(
        addItemToCart({
          productId,
          quantity: newQuantity,
          ...(selectedSizeId != null &&
            selectedSizeId !== "" && { selectedSizeId }),
        })
      ).unwrap();
      toast.success("Cart updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      if (rowId && previousQuantity != null) {
        dispatch(
          updateCartItemQuantityLocal({
            cartItemId: rowId,
            quantity: previousQuantity,
          })
        );
      }
      toast.error("Failed to update cart. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      if (rowId) setItemUpdating(rowId, false);
    }
  };

  const removeItem = async (cartItemId) => {
    if (updatingIds[cartItemId]) return;
    if (!window.confirm("Are you sure you want to remove this item?")) return;

    setItemUpdating(cartItemId, true);
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
    } finally {
      setItemUpdating(cartItemId, false);
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
      <LoadingIndicator fullScreen message="Loading your cart..." />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-deepRed-500">
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
            <a href="/" className="hover:text-deepRed-600">
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
                    updating={Boolean(updatingIds[cartItem._id])}
                  />
                ))}

              {/* Cart Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-lg shadow-md p-4">
                <button className="text-gray-700 font-semibold hover:text-deepRed-600 transition">
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
                  className="text-deepRed-600 font-semibold hover:text-deepRed-700 transition"
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
        {items?.length > 0 && <RecommendedProducts cartItems={items} />}
      </div>
    </div>
  );
}
