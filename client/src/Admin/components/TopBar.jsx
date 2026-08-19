import { IoMenu } from "react-icons/io5";
import { TbWorld } from "react-icons/tb";
import { TbBellRinging } from "react-icons/tb";
import Sugesstion from "./Sugesstion";
import { CiLogout } from "react-icons/ci";
import profileFallback from "../../assets/profile.webp";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../Redux/Slices/authSlice";
import { fetchOrders } from "../Redux/Slices/ordersSlice";

const READ_NOTIFICATIONS_KEY = "admin_read_notifications";

function loadReadIds() {
  try {
    const raw = localStorage.getItem(READ_NOTIFICATIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveReadIds(ids) {
  localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify([...ids]));
}

function formatRelativeTime(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function buildNotifications(orders) {
  return [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 20)
    .map((order) => {
      const customer =
        order.userId?.name ||
        order.shippingAddress?.fullName ||
        "Customer";
      const amount = Number(order.totalAmount || 0).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      const isNew = order.status === "placed";
      return {
        id: String(order._id || order.orderNumber),
        orderId: order._id,
        title: isNew ? "New order placed" : `Order ${order.status}`,
        message: `${customer} · ${order.orderNumber} · PKR ${amount}`,
        time: order.createdAt || order.updatedAt,
        status: order.status,
        urgent: isNew,
      };
    });
}

function TopBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: orders = [] } = useSelector((state) => state.orders);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readIds, setReadIds] = useState(() => loadReadIds());
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const notifications = useMemo(
    () => buildNotifications(Array.isArray(orders) ? orders : []),
    [orders]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.has(n.id)).length,
    [notifications, readIds]
  );

  const toggleNotifications = () => {
    setShowProfile(false);
    setShowNotifications((open) => !open);
  };

  const markAllRead = () => {
    const next = new Set(readIds);
    notifications.forEach((n) => next.add(n.id));
    setReadIds(next);
    saveReadIds(next);
  };

  const markOneRead = (id) => {
    const next = new Set(readIds);
    next.add(id);
    setReadIds(next);
    saveReadIds(next);
  };

  const openNotification = (notification) => {
    markOneRead(notification.id);
    setShowNotifications(false);
    navigate("/admin/orders");
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="w-full py-5 px-5 flex items-center justify-between">
      <div className="text-blue-500 text-xl h-10 w-10 hover:cursor-pointer hover:bg-blue-100 rounded-full flex items-center justify-center">
        <IoMenu />
      </div>
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          className="text-deepRed-600 bg-deepRed-200 uppercase font-medium px-8 rounded-md py-2"
        >
          clear cache
        </button>
        <button
          type="button"
          className="relative group text-blue-500 text-xl h-10 w-10 hover:bg-blue-100 rounded-full flex items-center justify-center"
          onClick={() => navigate("/")}
          aria-label="Visit store"
          title="Visit store"
        >
          <TbWorld />
          <Sugesstion>visit store</Sugesstion>
        </button>

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            className="relative text-blue-500 text-xl h-10 w-10 hover:bg-blue-100 rounded-full flex items-center justify-center"
            onClick={toggleNotifications}
            aria-label="Notifications"
            title="Notifications"
          >
            <TbBellRinging />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-deepRed-600 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white border shadow-lg z-50 rounded-md overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b bg-slate-50">
                <p className="font-semibold text-sm text-slate-800">
                  Notifications
                </p>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline"
                    onClick={markAllRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <ul className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-slate-500">
                    No notifications yet
                  </li>
                ) : (
                  notifications.map((notification) => {
                    const isUnread = !readIds.has(notification.id);
                    return (
                      <li key={notification.id}>
                        <button
                          type="button"
                          className={`w-full text-left px-3 py-3 border-b hover:bg-slate-50 transition ${
                            isUnread ? "bg-blue-50/60" : "bg-white"
                          }`}
                          onClick={() => openNotification(notification)}
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                                isUnread
                                  ? notification.urgent
                                    ? "bg-deepRed-500"
                                    : "bg-blue-500"
                                  : "bg-transparent"
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-800 capitalize">
                                {notification.title}
                              </p>
                              <p className="text-xs text-slate-600 truncate mt-0.5">
                                {notification.message}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-1">
                                {formatRelativeTime(notification.time)}
                              </p>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>

              <button
                type="button"
                className="w-full text-center text-sm font-medium text-blue-600 py-2 hover:bg-slate-50 border-t"
                onClick={() => {
                  setShowNotifications(false);
                  navigate("/admin/orders");
                }}
              >
                View all orders
              </button>
            </div>
          )}
        </div>

        <select name="" id="" className="text-blue-500 outline-none border-0">
          <option value="us-dollars">US-dollars</option>
        </select>
        <select name="" id="" className="text-blue-500 outline-none border-0">
          <option value="us-dollars">english</option>
        </select>
        <div
          className="flex items-center hover:text-blue-500 cursor-pointer justify-center gap-2 relative"
          ref={profileRef}
          onClick={() => {
            setShowNotifications(false);
            setShowProfile((show) => !show);
          }}
        >
          <img
            src={user?.avatar || profileFallback}
            className="h-8 w-8 rounded-full object-cover"
            alt={user?.name || "profile"}
          />
          <span className="text-sm font-medium capitalize">
            {user?.name || "Admin"}
          </span>
          <button type="button">
            <IoMdArrowDropdown />
          </button>
          {showProfile && (
            <ul className="absolute top-8 right-0 w-40 bg-white shadow-sm border text-black z-50">
              <li className="text-sm font-medium p-2 truncate">
                {user?.email || "—"}
              </li>
              <li
                className="flex items-center justify-start ps-2 gap-3 py-2 hover:bg-slate-100 px-1"
                onClick={() => navigate("/admin/profile")}
              >
                <span className="text-sm">
                  <FiUser />
                </span>
                <span className="capitalize ">profile</span>
              </li>
              <li
                className="flex items-center justify-start my-2 text-deepRed-500 ps-2 gap-3 py-2 hover:bg-slate-100 px-1"
                onClick={handleLogout}
              >
                <span className="text-sm">
                  <CiLogout />
                </span>
                <span className="capitalize text-sm text-nowrap">logout</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
