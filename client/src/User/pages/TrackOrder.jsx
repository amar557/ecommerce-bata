import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Package, CheckCircle, Truck, MapPin, ChevronRight, ArrowLeft } from "lucide-react";
import axiosInstance from "../../constants/axiosInstance";

const STATUS_STEPS = [
  { key: "placed", label: "Order Placed", icon: Package },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const getStatusColor = (status) => {
  switch (status) {
    case "placed":
      return "bg-orange-200 text-orange-600";
    case "confirmed":
      return "bg-blue-200 text-blue-600";
    case "shipped":
      return "bg-purple-200 text-purple-600";
    case "delivered":
      return "bg-green-200 text-green-600";
    default:
      return "bg-gray-200 text-gray-600";
  }
};

const getPaymentStatusColor = (status) => {
  return status === "paid" ? "bg-green-200 text-green-600" : "bg-red-200 text-red-600";
};

const formatPaymentMethod = (method) => {
  const methods = {
    card: "Card",
    upi: "UPI",
    wallet: "Wallet",
    netbanking: "Net Banking",
    cod: "Cash on Delivery",
  };
  return methods[method] || method;
};

// Order List Item Component
const OrderListItem = ({ order, onClick }) => {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentStep = STATUS_STEPS[safeIndex];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Order #{order.orderNumber}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">₹{order.totalAmount?.toFixed(2) || "0.00"}</p>
          <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(order.status)}`}>
            <currentStep.icon className="w-4 h-4" />
          </div>
          <span className={`text-sm font-semibold capitalize ${getStatusColor(order.status)} px-2 py-1 rounded`}>
            {order.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">{formatPaymentMethod(order.paymentMethod || "cod")}</span>
          <span className={`text-xs px-2 py-1 rounded font-semibold ${getPaymentStatusColor(order.paymentStatus || "unpaid")}`}>
            {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Click to view details</span>
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};

// Order Detail View Component
const OrderDetailView = ({ order, onBack }) => {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to orders</span>
          </button>
          <p className="text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600">Home</Link>
            <ChevronRight className="inline w-4 h-4 mx-1" />
            <span className="text-gray-900 font-semibold">Track Order</span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Order #{order.orderNumber}</h1>
          <p className="text-gray-600 text-sm">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Status timeline */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
          <div className="flex justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" style={{ width: "100%" }} />
            <div
              className="absolute top-5 left-0 h-1 bg-red-600 rounded-full transition-all duration-300"
              style={{ width: `${(safeIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
            {STATUS_STEPS.map((step, index) => {
              const isDone = index <= safeIndex;
              const isCurrent = index === safeIndex;
              const Icon = step.icon;
              return (
                <div key={step.key} className="relative flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                      isDone ? "bg-red-600 border-red-600 text-white" : "bg-white border-gray-300 text-gray-400"
                    } ${isCurrent ? "ring-4 ring-red-100" : ""}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`mt-2 text-xs font-semibold text-center ${isDone ? "text-red-600" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping address */}
        {order.shippingAddress && (order.shippingAddress.address || order.shippingAddress.fullName) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              Shipping Address
            </h2>
            <p className="text-gray-700">
              {order.shippingAddress.fullName}
              {order.shippingAddress.phone && ` • ${order.shippingAddress.phone}`}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {[order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.pincode]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}

        {/* Payment info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Payment Information</h2>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Method:</strong> {formatPaymentMethod(order.paymentMethod || "cod")}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Status:</strong>{" "}
            <span className={`text-xs py-1 px-2 rounded-2xl font-semibold capitalize ${getPaymentStatusColor(order.paymentStatus || "unpaid")}`}>
              {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
            </span>
          </p>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Items</h2>
          <ul className="space-y-3">
            {order.items?.map((item, idx) => (
              <li key={idx} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                {item.thumbnailImage && (
                  <img
                    src={item.thumbnailImage}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity}
                    {item.sizeLabel && ` • Size: ${item.sizeLabel}`}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  ₹{(item.discountPrice != null && item.discountPrice < item.price ? item.discountPrice : item.price) * item.quantity}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>₹{order.totalAmount?.toFixed(2) ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // If orderId in URL, fetch that specific order
  useEffect(() => {
    if (orderId) {
      setLoading(true);
      setError(null);
      let cancelled = false;
      axiosInstance
        .get(`/api/cart/order/${orderId}`)
        .then(({ data }) => {
          if (!cancelled) {
            setSelectedOrder(data);
            setOrders([]);
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err.response?.data?.msg || "Failed to load order");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => { cancelled = true; };
    }
  }, [orderId]);

  // If no orderId, fetch all user orders
  useEffect(() => {
    if (!orderId) {
      setLoading(true);
      setError(null);
      let cancelled = false;
      axiosInstance
        .get("/api/cart/orders")
        .then(({ data }) => {
          if (!cancelled) {
            setOrders(data || []);
            setSelectedOrder(null);
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err.response?.data?.msg || "Failed to load orders");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => { cancelled = true; };
    }
  }, [orderId]);

  const handleOrderClick = (order) => {
    navigate(`/track-order/${order._id}`);
  };

  const handleBack = () => {
    navigate("/track-order");
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error && !selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <Link to="/" className="text-red-600 hover:underline">Back to home</Link>
        </div>
      </div>
    );
  }

  // Show selected order detail (from URL or clicked)
  if (selectedOrder) {
    return <OrderDetailView order={selectedOrder} onBack={handleBack} />;
  }

  // Show list of all orders
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">
            <Link to="/" className="hover:text-red-600">Home</Link>
            <ChevronRight className="inline w-4 h-4 mx-1" />
            <span className="text-gray-900 font-semibold">My Orders</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Track Your Orders</h1>
          <p className="text-gray-600 mt-1">Click on any order to view its status and details</p>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderListItem
                key={order._id}
                order={order}
                onClick={() => handleOrderClick(order)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
