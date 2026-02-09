/** @format */

import { useEffect, useState } from "react";
import { IoEyeOutline, IoClose } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../Redux/Slices/ordersSlice";
import { toast } from "react-toastify";

function Orders() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.orders);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Ensure orders is always an array
  const orders = Array.isArray(items) ? items : [];

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus({ ...updatingStatus, [orderId]: true });
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      toast.success("Order status updated successfully!");
    } catch (err) {
      toast.error(err?.msg || "Failed to update order status");
    } finally {
      setUpdatingStatus({ ...updatingStatus, [orderId]: false });
    }
  };

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

  const downloadInvoice = (order) => {
    try {
      if (!order || !order.orderNumber) {
        toast.error("Invalid order data");
        return;
      }

      const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice - ${order.orderNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
    .company { font-size: 24px; font-weight: bold; color: #dc2626; }
    .invoice-title { font-size: 18px; margin-top: 10px; }
    .details { display: flex; justify-content: space-between; margin: 20px 0; }
    .section { flex: 1; }
    .section h3 { margin-bottom: 10px; color: #333; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f3f4f6; font-weight: bold; }
    .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
    .status { display: inline-block; padding: 5px 10px; border-radius: 5px; font-weight: bold; }
    .paid { background-color: #d1fae5; color: #065f46; }
    .unpaid { background-color: #fee2e2; color: #991b1b; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">BATA</div>
    <div class="invoice-title">INVOICE</div>
  </div>
  <div class="details">
    <div class="section">
      <h3>Order Details</h3>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
      <p><strong>Payment Method:</strong> ${formatPaymentMethod(order.paymentMethod || 'cod')}</p>
      <p><strong>Payment Status:</strong> <span class="status ${(order.paymentStatus || 'unpaid') === 'paid' ? 'paid' : 'unpaid'}">${(order.paymentStatus || 'unpaid').toUpperCase()}</span></p>
      <p><strong>Delivery Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
    </div>
    <div class="section">
      <h3>Customer Information</h3>
      <p><strong>Name:</strong> ${order.userId?.name || "N/A"}</p>
      <p><strong>Email:</strong> ${order.userId?.email || "N/A"}</p>
      ${order.shippingAddress?.address ? `
      <h3 style="margin-top: 20px;">Shipping Address</h3>
      <p>${order.shippingAddress.fullName || ""}</p>
      <p>${[order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.pincode].filter(Boolean).join(", ")}</p>
      ` : ""}
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Size</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.items?.map((item) => `
        <tr>
          <td>${item.title}</td>
          <td>${item.sizeLabel || "N/A"}</td>
          <td>${item.quantity}</td>
          <td>₹${(item.discountPrice != null && item.discountPrice < item.price ? item.discountPrice : item.price).toFixed(2)}</td>
          <td>₹${((item.discountPrice != null && item.discountPrice < item.price ? item.discountPrice : item.price) * item.quantity).toFixed(2)}</td>
        </tr>
      `).join("") || ""}
    </tbody>
  </table>
  <div class="total">
    <p>Total Amount: ₹${order.totalAmount?.toFixed(2) || "0.00"}</p>
  </div>
  <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
    <p>Thank you for your order!</p>
    <p>BATA - Quality Footwear Since 1894</p>
  </div>
</body>
</html>
    `;

      const blob = new Blob([invoiceHTML], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${order.orderNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-slate-200 px-6 py-8">
        <div className="text-center text-gray-600">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-200 px-6 py-8">
        <div className="text-center text-red-600">Error: {error?.msg || "Failed to load orders"}</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-200 px-6">
      <div>
        <h1 className="capitalize text-xl font-semibold">All Orders</h1>
        <h1 className="first-letter:uppercase">You have {orders?.length || 0} orders</h1>
      </div>
      <div className="w-full my-5">
        <div className="flex items-center flex-col justify-between bg-white rounded-sm shadow-slate-300 shadow-md py-4 grow-[2]">
          <div className="flex items-center justify-between w-full mb-4 px-6">
            <p className="font-semibold text-sm">Orders</p>
            <button
              onClick={() => dispatch(fetchOrders())}
              className="bg-black text-white px-3 uppercase text-sm font-semibold py-1 rounded-3xl hover:bg-gray-800"
            >
              Refresh
            </button>
          </div>
          <div className="flex gap-3 w-full overflow-x-auto flex-col px-2">
            {/* Header */}
            <div className="flex min-w-max gap-4 bg-slate-100 py-2 px-4 items-center justify-between">
              <p className="text-center w-24 capitalize font-semibold">#</p>
              <p className="text-center w-32 capitalize font-semibold">Order Number</p>
              <p className="text-center w-32 capitalize font-semibold">Customer</p>
              <p className="text-center w-24 capitalize font-semibold">Date</p>
              <p className="text-center w-24 capitalize font-semibold">Items</p>
              <p className="text-center w-28 capitalize font-semibold">Total Amount</p>
              <p className="text-center w-32 capitalize font-semibold">Payment Method</p>
              <p className="text-center w-28 capitalize font-semibold">Payment Status</p>
              <p className="text-center w-32 capitalize font-semibold">Delivery Status</p>
              <p className="text-center w-32 capitalize font-semibold">Options</p>
            </div>

            {/* Orders List */}
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order, index) => (
                <div
                  key={order._id}
                  className="flex min-w-max gap-4 bg-white border-b border-gray-100 py-3 px-4 items-center justify-between hover:bg-gray-50"
                >
                  <p className="text-center w-24">{index + 1}</p>
                  <p className="text-center w-32 font-semibold text-sm">{order.orderNumber}</p>
                  <div className="text-center w-32">
                    <p className="font-semibold text-sm">{order.userId?.name || "N/A"}</p>
                    <p className="text-xs text-gray-500">{order.userId?.email || ""}</p>
                  </div>
                  <p className="text-center w-24 text-sm">{formatDate(order.createdAt)}</p>
                  <p className="text-center w-24 font-semibold">{order.items?.length || 0}</p>
                  <p className="text-center w-28 font-semibold">₹{order.totalAmount?.toFixed(2) || "0.00"}</p>
                  <p className="text-center w-32 text-sm capitalize">{formatPaymentMethod(order.paymentMethod || "cod")}</p>
                  <div className="text-center w-28">
                    <span className={`text-xs py-1 px-2 rounded-2xl font-semibold capitalize ${getPaymentStatusColor(order.paymentStatus || "unpaid")}`}>
                      {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  <div className="text-center w-32">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingStatus[order._id]}
                      className={`text-xs py-1 px-2 rounded-2xl font-semibold capitalize border-0 outline-none cursor-pointer ${getStatusColor(order.status)}`}
                    >
                      <option value="placed">Placed</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  <div className="text-center w-32 capitalize font-semibold flex flex-col gap-1 items-center justify-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-100 text-black hover:bg-blue-400 hover:text-white w-8 h-8 rounded-full grid place-items-center transition"
                      title="View Order Details"
                    >
                      <IoEyeOutline />
                    </button>
                    <button
                      onClick={() => downloadInvoice(order)}
                      className="bg-black text-white hover:bg-gray-700 w-8 h-8 rounded-full grid place-items-center transition"
                      title="Download Invoice"
                    >
                      <LuDownload />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No orders found</div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Order Details - {selectedOrder.orderNumber}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong> {selectedOrder.userId?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {selectedOrder.userId?.email || "N/A"}
                </p>
              </div>
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.shippingAddress.fullName}
                    {selectedOrder.shippingAddress.phone && ` • ${selectedOrder.shippingAddress.phone}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {[
                      selectedOrder.shippingAddress.address,
                      selectedOrder.shippingAddress.city,
                      selectedOrder.shippingAddress.state,
                      selectedOrder.shippingAddress.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Method:</strong> {formatPaymentMethod(selectedOrder.paymentMethod || "cod")}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Status:</strong>{" "}
                  <span className={`text-xs py-1 px-2 rounded-2xl font-semibold capitalize ${getPaymentStatusColor(selectedOrder.paymentStatus || "unpaid")}`}>
                    {selectedOrder.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-2 bg-gray-50 rounded">
                      {item.thumbnailImage && (
                        <img
                          src={item.thumbnailImage}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                          {item.sizeLabel && ` • Size: ${item.sizeLabel}`}
                        </p>
                        <p className="text-sm font-semibold mt-1">
                          ₹
                          {(item.discountPrice != null && item.discountPrice < item.price
                            ? item.discountPrice
                            : item.price) * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>₹{selectedOrder.totalAmount?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Status: </span>
                  <span className={`text-xs py-1 px-2 rounded-2xl font-semibold capitalize ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
