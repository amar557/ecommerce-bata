import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  CreditCard,
  ChevronRight,
  Lock,
  Truck,
  Package,
  MapPin,
  Check,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { fetchCart, checkoutUserCart } from "../../Admin/Redux/Slices/cartSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../constants/axiosInstance";

// Progress Steps Component
const CheckoutProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Cart", icon: ShoppingCart },
    { id: 2, name: "Information", icon: User },
    { id: 3, name: "Payment", icon: CreditCard },
    { id: 4, name: "Confirmation", icon: Check },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                  currentStep >= step.id
                    ? "bg-deepRed-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <span
                className={`text-sm mt-2 font-semibold ${
                  currentStep >= step.id ? "text-deepRed-600" : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition ${
                  currentStep > step.id ? "bg-deepRed-600" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Shipping Address Form Component
const ShippingAddressForm = ({ formData, setFormData, savedAddresses }) => {
  const [useNewAddress, setUseNewAddress] = useState(true);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
        <MapPin className="w-6 h-6 text-deepRed-600" />
      </div>

      {/* Saved Addresses */}
      {/* {savedAddresses.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Select Saved Address
          </h3>
          <div className="space-y-3">
            {savedAddresses.map((address, index) => (
              <label
                key={index}
                className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-deepRed-600 transition"
              >
                <input
                  type="radio"
                  name="savedAddress"
                  className="mt-1 w-4 h-4 text-deepRed-600"
                  onChange={() => {
                    setUseNewAddress(false);
                    setFormData(address);
                  }}
                />
                <div className="ml-3 flex-1">
                  <p className="font-semibold text-gray-900">
                    {address.fullName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.address}, {address.city}, {address.state} -{" "}
                    {address.pincode}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {address.phone}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={() => setUseNewAddress(true)}
            className="mt-4 text-deepRed-600 font-semibold hover:text-deepRed-700 transition"
          >
            + Add New Address
          </button>
        </div>
      )} */}

      {/* New Address Form */}
      {useNewAddress && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-deepRed-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-deepRed-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john.doe@example.com"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-deepRed-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="House No, Street, Area"
              rows="3"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-deepRed-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Rawalpindi"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-deepRed-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Punjab"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-deepRed-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="110001"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-deepRed-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="saveAddress"
                checked={formData.saveAddress}
                onChange={(e) =>
                  setFormData({ ...formData, saveAddress: e.target.checked })
                }
                className="w-4 h-4 text-deepRed-600 rounded"
              />
              <span className="text-sm text-gray-700">
                Save this address for future orders
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

// Payment Method Component
const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: Package,
      description: "Pay when you receive your order",
    },
    {
      id: "stripe",
      name: "Pay with Stripe",
      icon: CreditCard,
      description: "Secure card payment via Stripe",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
        <Lock className="w-6 h-6 text-green-600" />
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
              paymentMethod === method.id
                ? "border-deepRed-600 bg-deepRed-50"
                : "border-gray-200 hover:border-deepRed-600"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-deepRed-600"
            />
            <method.icon className="w-6 h-6 text-gray-600 mx-4" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{method.name}</p>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
            {paymentMethod === method.id && (
              <Check className="w-5 h-5 text-deepRed-600" />
            )}
          </label>
        ))}
      </div>

      {paymentMethod === "stripe" && (
        <div className="mt-4 rounded-lg border border-deepRed-200 bg-deepRed-50 p-4">
          <p className="text-sm font-semibold text-deepRed-800">
            Pay securely with Stripe
          </p>
          <p className="mt-1 text-sm text-deepRed-700">
            Fill in your shipping details, then click{" "}
            <strong>Pay with Stripe</strong> below. Stripe&apos;s card payment
            form will appear on this page so you can complete payment.
          </p>
        </div>
      )}
    </div>
  );
};

function StripeEmbeddedPay({ clientSecret, publishableKey, onClose }) {
  const stripePromise = useMemo(
    () => loadStripe(publishableKey),
    [publishableKey]
  );
  const options = useMemo(() => ({ clientSecret }), [clientSecret]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 border-2 border-deepRed-600">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Complete payment</h2>
          <p className="text-sm text-gray-600">
            Enter your card details below via Stripe
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-gray-600 hover:text-deepRed-600 font-medium"
        >
          Cancel
        </button>
      </div>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

// Order Summary Component
const OrderSummary = ({ cartItems, discount, shippingCost }) => {
  const subtotal = (cartItems || []).reduce((sum, item) => {
    let product = item?.productId;
    const price =
      product?.price > product?.discountPrice
        ? product.discountPrice
        : product.price;
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount + shippingCost;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {cartItems?.length > 0 &&
          cartItems.map((item) => {
            let product = item?.productId;
            const sizeObj = product?.sizes && item?.selectedSizeId
              ? product.sizes.find((s) => String(s._id) === String(item.selectedSizeId))
              : null;
            const sizeLabel = sizeObj ? sizeObj.size : "—";
            return (
              <div key={item._id} className="flex space-x-3">
                <img
                  src={product.thumbnailImage}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {product.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {product.brandId.brand}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-600">
                      Size: {sizeLabel} | Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      PKR 
                      {(product?.price > product?.discountPrice
                        ? product.discountPrice
                        : product.price) * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6 pb-6 border-t pt-6">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal ({(cartItems || []).length} items)</span>
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
            {shippingCost === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `PKR ${shippingCost}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Tax (GST 18%)</span>
          <span className="font-semibold">PKR {(total * 0.18).toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-6 pb-6 border-t pt-6">
        <span>Total Amount</span>
        <span>PKR {(total + total * 0.18).toFixed(2)}</span>
      </div>

      {/* Security Badge */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 text-green-700">
          <Lock className="w-5 h-5" />
          <span className="text-sm font-semibold">Secure Checkout</span>
        </div>
        <p className="text-xs text-green-600 mt-1">
          Your payment information is encrypted and secure
        </p>
      </div>

      {/* Delivery Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-700">
          <Truck className="w-5 h-5" />
          <span className="text-sm font-semibold">Expected Delivery</span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Your order will be delivered in 3-5 business days
        </p>
      </div>
    </div>
  );
};

// Main Checkout Page Component
export default function CheckoutPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [stripePay, setStripePay] = useState(null);
  const { items, error, loading } = useSelector((state) => state.cart);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const isLoggedIn = Boolean(
    token || localStorage.getItem("token") || user?.email || user?.name
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("canceled") === "1") {
      toast.info("Stripe payment was canceled. You can try again.");
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    saveAddress: false,
  });

  const savedAddresses = [];
  const discount = 0;
  const shippingCost = 0;

  const closeStripePay = useCallback(() => setStripePay(null), []);

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to place an order.");
      return;
    }
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      !formData.address
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!items?.length) {
      toast.error("Your cart is empty.");
      return;
    }

    setPlacing(true);
    try {
      if (paymentMethod === "stripe") {
        let publishableKey = null;
        try {
          const { data: cfg } = await axiosInstance.get(
            "/api/cart/stripe/config"
          );
          publishableKey = cfg?.publishableKey || null;
        } catch {
          publishableKey = null;
        }

        const useEmbedded =
          Boolean(publishableKey) &&
          !String(publishableKey).includes("REPLACE");

        const result = await dispatch(
          checkoutUserCart({
            shippingAddress: formData,
            paymentMethod: "stripe",
            embedded: useEmbedded,
          })
        ).unwrap();

        if (useEmbedded && result?.clientSecret) {
          setStripePay({
            clientSecret: result.clientSecret,
            publishableKey: result.publishableKey || publishableKey,
          });
          setCurrentStep(3);
          toast.success("Enter your card details below to pay with Stripe.");
          return;
        }

        if (result?.url) {
          window.location.assign(result.url);
          return;
        }

        throw new Error(
          result?.msg ||
            "Could not open Stripe payment. Check STRIPE_PUBLISHABLE_KEY in server/.env and restart the server."
        );
      }

      const result = await dispatch(
        checkoutUserCart({ shippingAddress: formData, paymentMethod: "cod" })
      ).unwrap();

      const orderId = result?.orderId;
      if (orderId) {
        navigate(`/order-success?orderId=${orderId}`);
      } else {
        navigate("/order-success");
      }
    } catch (err) {
      const msg =
        err?.error ||
        err?.warn ||
        err?.msg ||
        err?.message ||
        (typeof err === "string" ? err : "Failed to place order.");
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            <a href="/" className="hover:text-deepRed-600">
              Home
            </a>{" "}
            /
            <a href="/cart" className="hover:text-deepRed-600">
              {" "}
              Cart
            </a>{" "}
            /<span className="text-gray-900 font-semibold"> Checkout</span>
          </p>
        </div>

        {/* Progress Steps */}
        <CheckoutProgress currentStep={currentStep} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <ShippingAddressForm
              formData={formData}
              setFormData={setFormData}
              savedAddresses={savedAddresses}
            />

            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={(method) => {
                setPaymentMethod(method);
                setStripePay(null);
              }}
            />

            {stripePay?.clientSecret && stripePay?.publishableKey ? (
              <StripeEmbeddedPay
                clientSecret={stripePay.clientSecret}
                publishableKey={stripePay.publishableKey}
                onClose={closeStripePay}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="flex items-start space-x-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-deepRed-600 rounded mt-1"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-deepRed-600 font-semibold hover:text-deepRed-700"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-deepRed-600 font-semibold hover:text-deepRed-700"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full bg-deepRed-600 text-white py-4 rounded-lg font-bold hover:bg-deepRed-700 transition flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {placing ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {paymentMethod === "stripe"
                        ? "Opening Stripe payment..."
                        : "Placing order..."}
                    </span>
                  ) : (
                    <>
                      <span>
                        {paymentMethod === "stripe"
                          ? "Pay with Stripe"
                          : "Place Order"}
                      </span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <OrderSummary
              cartItems={items}
              discount={discount}
              shippingCost={shippingCost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
