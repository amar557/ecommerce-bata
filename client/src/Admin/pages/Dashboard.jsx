import { FaArrowTrendUp } from "react-icons/fa6";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaProductHunt } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import Chart from "../components/Chart";
import { FaRegStar } from "react-icons/fa6";
import { FaShopLock } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchOrders } from "../Redux/Slices/ordersSlice";
import { fetchProducts } from "../Redux/Slices/productSlice";
import {
  getAccessories,
  getBrands,
  getCategories,
} from "../Redux/Async/Asynch";
import axiosInstance from "../../constants/axiosInstance";
import { toast } from "react-toastify";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function filterOrdersByPeriod(orders, period) {
  const now = new Date();
  const thisYear = now.getFullYear();

  if (period === "lifetime") return orders;

  return orders.filter((order) => {
    const d = new Date(order.createdAt || order.updatedAt);
    if (Number.isNaN(d.getTime())) return false;
    if (period === "thisYear") return d.getFullYear() === thisYear;
    if (period === "lastYear") return d.getFullYear() === thisYear - 1;
    return true;
  });
}

function orderItemTotal(item) {
  const unit =
    item.discountPrice != null && item.discountPrice < item.price
      ? item.discountPrice
      : item.price || 0;
  return unit * (item.quantity || 1);
}

function formatMoney(amount) {
  return `PKR ${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function statusBadgeClass(status) {
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
}

function paymentBadgeClass(status) {
  return status === "paid"
    ? "bg-green-200 text-green-600"
    : "bg-deepRed-200 text-deepRed-600";
}

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(null);
  const [period, setPeriod] = useState("lifetime");
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);

  const { items: orders = [], loading: ordersLoading } = useSelector(
    (state) => state.orders
  );
  const { items: productsRaw, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const {
    brands = [],
    categories = [],
    accessories = [],
  } = useSelector((state) => state.Categories);

  const products = Array.isArray(productsRaw)
    ? productsRaw
    : productsRaw?.items || [];

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getAccessories());

    async function loadCustomers() {
      setCustomersLoading(true);
      try {
        const { data } = await axiosInstance.get("/api/auth/users");
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setCustomers([]);
      } finally {
        setCustomersLoading(false);
      }
    }
    loadCustomers();
  }, [dispatch]);

  const periodOrders = useMemo(
    () => filterOrdersByPeriod(orders, period),
    [orders, period]
  );

  const totalSales = useMemo(
    () =>
      periodOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0),
    [periodOrders]
  );

  const customerCount = useMemo(() => {
    const nonAdmins = customers.filter((u) => !u.admin);
    return nonAdmins.length || customers.length;
  }, [customers]);

  const orderStats = useMemo(() => {
    const groups = {
      placed: { count: 0, amount: 0 },
      processing: { count: 0, amount: 0 },
      delivered: { count: 0, amount: 0 },
    };

    periodOrders.forEach((order) => {
      const amount = Number(order.totalAmount) || 0;
      if (order.status === "delivered") {
        groups.delivered.count += 1;
        groups.delivered.amount += amount;
      } else if (order.status === "confirmed" || order.status === "shipped") {
        groups.processing.count += 1;
        groups.processing.amount += amount;
      } else {
        groups.placed.count += 1;
        groups.placed.amount += amount;
      }
    });

    return groups;
  }, [periodOrders]);

  const monthlySales = useMemo(() => {
    const year =
      period === "lastYear"
        ? new Date().getFullYear() - 1
        : new Date().getFullYear();

    const buckets = MONTHS.map((month) => ({ month, sales: 0 }));

    const source =
      period === "lifetime"
        ? orders
        : filterOrdersByPeriod(orders, period === "lastYear" ? "lastYear" : "thisYear");

    source.forEach((order) => {
      const d = new Date(order.createdAt || order.updatedAt);
      if (Number.isNaN(d.getTime())) return;
      if (period !== "lifetime" && d.getFullYear() !== year) return;
      if (period === "lifetime") {
        // for lifetime mini chart, aggregate across all years into months
      } else if (d.getFullYear() !== year) {
        return;
      }
      buckets[d.getMonth()].sales += Number(order.totalAmount) || 0;
    });

    return buckets;
  }, [orders, period]);

  const categorySales = useMemo(() => {
    const productMap = new Map(
      products.map((p) => [String(p._id), p])
    );
    const totals = new Map();

    categories.forEach((c) => {
      totals.set(c.category, 0);
    });

    periodOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const productId = item.productId?._id || item.productId;
        const product = productMap.get(String(productId));
        const categoryName =
          product?.categoryId?.category ||
          product?.category ||
          "Uncategorized";
        const prev = totals.get(categoryName) || 0;
        totals.set(categoryName, prev + orderItemTotal(item));
      });
    });

    const rows = [...totals.entries()].map(([category, sale]) => ({
      category,
      sale: Number(sale.toFixed(2)),
    }));

    if (rows.length === 0) {
      return [{ category: "No sales", sale: 0 }];
    }
    return rows;
  }, [periodOrders, products, categories]);

  const recentOrders = useMemo(() => {
    return [...periodOrders]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 8);
  }, [periodOrders]);

  const needsAttention = orderStats.placed.count;

  const loading = ordersLoading || productsLoading || customersLoading;

  const selectPeriod = (value) => {
    setPeriod(value);
    setMenuOpen(null);
  };

  const periodLabel =
    period === "thisYear"
      ? "This year"
      : period === "lastYear"
        ? "Last year"
        : "Lifetime";

  const PeriodDropdown = ({ id }) => (
    <div className="dropdown inline-block relative">
      <button
        type="button"
        className="bg-blue-300 text-gray-700 font-semibold py-1 text-sm px-2 rounded-full inline-flex items-center"
        onClick={() => setMenuOpen(menuOpen === id ? null : id)}
      >
        <span className="mr-1">{periodLabel}</span>
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </button>
      {menuOpen === id && (
        <ul className="absolute right-0 z-20 text-gray-700 pt-1 shadow">
          <li>
            <button
              type="button"
              className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block w-full text-left whitespace-nowrap"
              onClick={() => selectPeriod("thisYear")}
            >
              this year
            </button>
          </li>
          <li>
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block w-full text-left whitespace-nowrap"
              onClick={() => selectPeriod("lastYear")}
            >
              last year
            </button>
          </li>
          <li>
            <button
              type="button"
              className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block w-full text-left whitespace-nowrap"
              onClick={() => selectPeriod("lifetime")}
            >
              lifetime
            </button>
          </li>
        </ul>
      )}
    </div>
  );

  const downloadInvoice = (order) => {
    try {
      if (!order?.orderNumber) {
        toast.error("Invalid order data");
        return;
      }
      const customer =
        order.userId?.name ||
        order.shippingAddress?.fullName ||
        "Customer";
      const rows = (order.items || [])
        .map(
          (item) =>
            `<tr><td>${item.title || "Item"}</td><td>${item.quantity || 1}</td><td>${formatMoney(orderItemTotal(item))}</td></tr>`
        )
        .join("");
      const html = `<!DOCTYPE html><html><head><title>Invoice ${order.orderNumber}</title>
        <style>body{font-family:Arial,sans-serif;padding:24px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;text-align:left}</style>
        </head><body>
        <h1>Invoice ${order.orderNumber}</h1>
        <p>Customer: ${customer}</p>
        <p>Status: ${order.status} | Payment: ${order.paymentStatus}</p>
        <table><thead><tr><th>Product</th><th>Qty</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table>
        <h3>Total: ${formatMoney(order.totalAmount)}</h3>
        </body></html>`;
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${order.orderNumber}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download invoice");
    }
  };

  return (
    <div className="p-8 bg-slate-200">
      {loading && (
        <p className="mb-4 text-sm text-slate-600">Loading dashboard data…</p>
      )}

      <div className="flex items-center justify-between gap-8 mb-6 flex-wrap">
        <div className="flex items-center justify-between bg-white rounded-sm shadow-slate-300 shadow-md px-6 py-4 grow min-w-[160px]">
          <div className="grow flex flex-col items-start justify-start">
            <p className="capitalize text-slate-500 font-medium">orders</p>
            <p className="text-2xl font-bold">{periodOrders.length}</p>
          </div>
          <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
            <FaArrowTrendUp />
          </div>
        </div>
        <div className="flex items-center justify-between bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md min-w-[160px]">
          <div className="grow flex flex-col items-start justify-start">
            <p className="capitalize text-slate-500 font-medium">sale</p>
            <p className="text-2xl font-bold">{formatMoney(totalSales)}</p>
          </div>
          <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
            <BsCurrencyDollar />
          </div>
        </div>
        <div className="flex items-center justify-between bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md min-w-[160px]">
          <div className="grow flex flex-col items-start justify-start">
            <p className="capitalize text-slate-500 font-medium">product</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
            <FaProductHunt />
          </div>
        </div>
        <div className="flex items-center justify-between bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md min-w-[160px]">
          <div className="grow flex flex-col items-start justify-start">
            <p className="capitalize text-slate-500 font-medium">customer</p>
            <p className="text-2xl font-bold">{customerCount}</p>
          </div>
          <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
            <FiUsers />
          </div>
        </div>
      </div>

      <div className="flex items-stretch justify-between gap-8 mb-6 flex-wrap">
        <div className="flex items-center flex-col justify-between bg-white rounded-sm shadow-slate-300 shadow-md px-6 py-4 grow-[2] min-w-[280px]">
          <div className="flex w-full items-center justify-between">
            <p className="text-base font-bold capitalize">order statistics</p>
            <PeriodDropdown id="order-stats" />
          </div>
          <div className="flex items-center justify-between w-full py-4 px-4 gap-4 flex-wrap">
            <div className="flex items-center justify-center flex-col gap-2">
              <p className="text-xl font-bold">{orderStats.placed.count}</p>
              <p className="text-blue-700 font-semibold">
                {formatMoney(orderStats.placed.amount)}
              </p>
              <p className="text-slate-400 font-semibold text-sm">placed</p>
            </div>
            <div className="flex items-center justify-center flex-col gap-2">
              <p className="text-xl font-bold">{orderStats.processing.count}</p>
              <p className="text-blue-700 font-semibold">
                {formatMoney(orderStats.processing.amount)}
              </p>
              <p className="text-slate-400 font-semibold text-sm">processing</p>
            </div>
            <div className="flex items-center justify-center flex-col gap-2">
              <p className="text-xl font-bold">{orderStats.delivered.count}</p>
              <p className="text-blue-700 font-semibold">
                {formatMoney(orderStats.delivered.amount)}
              </p>
              <p className="text-slate-400 font-semibold text-sm">delivered</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md min-w-[200px]">
          <div className="grow flex flex-col h-40 w-full overflow-hidden items-start justify-start">
            <Chart data={monthlySales} />
          </div>
        </div>

        <div className="flex flex-col gap-3 grow min-w-[180px]">
          <div className="flex items-center justify-between bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md">
            <div className="grow flex flex-col items-start justify-start">
              <p className="capitalize text-slate-500 font-medium">brands</p>
              <p className="text-2xl font-bold">{brands.length}</p>
            </div>
            <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
              <FaRegStar />
            </div>
          </div>
          <div className="flex items-center justify-between bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md">
            <div className="grow flex flex-col items-start justify-start">
              <p className="capitalize text-slate-500 font-medium">categories</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
            <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
              <FaShopLock />
            </div>
          </div>
          <div className="flex items-center justify-between bg-white px-6 py-4 grow rounded-sm shadow-slate-300 shadow-md">
            <div className="grow flex flex-col items-start justify-start">
              <p className="capitalize text-slate-500 font-medium">
                accessories
              </p>
              <p className="text-2xl font-bold">{accessories.length}</p>
            </div>
            <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
              <FaRegStar />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-8 mb-6 flex-wrap">
        <div className="flex items-center flex-col justify-between bg-white rounded-sm shadow-slate-300 shadow-md px-6 py-4 grow-[2] min-w-[300px]">
          <div className="flex w-full items-center justify-between">
            <p className="text-base font-bold capitalize">
              Category Product Sales Statistics
            </p>
            <PeriodDropdown id="category-sales" />
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categorySales}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barSize={20}
              >
                <XAxis
                  dataKey="category"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar
                  dataKey="sale"
                  fill="#000000"
                  background={{ fill: "#ffffff" }}
                  barSize={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex items-center flex-col justify-between bg-white rounded-sm shadow-slate-300 shadow-md px-6 py-4 grow-[2] min-w-[300px]">
          <div className="flex w-full items-center justify-between">
            <p className="text-base font-bold capitalize">sales state</p>
            <PeriodDropdown id="sales-state" />
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlySales}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barSize={20}
              >
                <XAxis
                  dataKey="month"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar
                  dataKey="sales"
                  fill="#000000"
                  background={{ fill: "#ffffff" }}
                  barSize={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-start gap-3 flex-wrap">
        <div className="grow min-w-[300px] max-w-full">
          <div className="flex items-center flex-col justify-between bg-white rounded-sm shadow-slate-300 shadow-md py-4">
            <div className="flex items-center justify-between w-full mb-4 px-6">
              <p className="font-semibold text-sm">invoices</p>
              <button
                type="button"
                className="bg-black text-white px-3 uppercase text-sm font-semibold py-1 rounded-3xl"
                onClick={() => navigate("/admin/orders")}
              >
                view more
              </button>
            </div>
            <div className="flex gap-3 w-full overflow-x-auto flex-col px-2">
              <div className="flex min-w-max gap-4 bg-slate-100 py-2 px-4 items-center justify-between">
                <p className="text-center w-20 capitalize font-semibold">#</p>
                <p className="text-center w-28 capitalize font-semibold">
                  order code
                </p>
                <p className="text-center w-28 capitalize font-semibold">
                  customer
                </p>
                <p className="text-center w-24 capitalize font-semibold">
                  total product
                </p>
                <p className="text-center w-28 capitalize font-semibold">
                  total amount
                </p>
                <p className="text-center w-28 capitalize font-semibold">
                  delivery status
                </p>
                <p className="text-center w-28 capitalize font-semibold">
                  payment status
                </p>
                <p className="text-center w-20 capitalize font-semibold">
                  options
                </p>
              </div>

              {recentOrders.length === 0 ? (
                <p className="text-center text-slate-500 py-8">No orders yet</p>
              ) : (
                recentOrders.map((order, i) => {
                  const itemCount = (order.items || []).reduce(
                    (sum, item) => sum + (item.quantity || 1),
                    0
                  );
                  const customer =
                    order.userId?.name ||
                    order.shippingAddress?.fullName ||
                    "Customer";
                  return (
                    <div
                      key={order._id || order.orderNumber}
                      className="flex min-w-max gap-4 items-center justify-between py-2 px-4 border-b border-slate-100"
                    >
                      <p className="text-center w-20">{i + 1}</p>
                      <p className="text-center w-28 text-sm">
                        {order.orderNumber}
                      </p>
                      <p className="text-center w-28 capitalize text-sm truncate">
                        {customer}
                      </p>
                      <p className="text-center w-24 font-semibold">
                        {itemCount}
                      </p>
                      <p className="text-center w-28 text-sm">
                        {formatMoney(order.totalAmount)}
                      </p>
                      <p
                        className={`text-sm py-1 px-2 text-center rounded-2xl w-28 capitalize font-semibold ${statusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </p>
                      <p
                        className={`text-sm py-1 px-2 text-center rounded-2xl w-28 capitalize font-semibold ${paymentBadgeClass(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </p>
                      <p className="text-center w-20 font-semibold flex flex-col gap-1 items-center justify-center">
                        <button
                          type="button"
                          className="bg-blue-100 text-black hover:bg-blue-400 hover:text-white w-8 h-8 rounded-full grid place-items-center"
                          onClick={() => navigate("/admin/orders")}
                          title="View orders"
                        >
                          <IoEyeOutline />
                        </button>
                        <button
                          type="button"
                          className="bg-black text-white w-8 h-8 rounded-full grid place-items-center"
                          onClick={() => downloadInvoice(order)}
                          title="Download invoice"
                        >
                          <LuDownload />
                        </button>
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start w-full md:w-1/3 bg-white justify-start min-w-[220px]">
          <div className="bg-blue-400 text-white w-full p-4">
            <p className="text-3xl font-bold">{needsAttention}</p>
            <p className="first-letter:uppercase">orders need attention</p>
          </div>
          <button
            type="button"
            className="p-4 capitalize text-blue-600 hover:underline"
            onClick={() => navigate("/admin/orders")}
          >
            view all
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
