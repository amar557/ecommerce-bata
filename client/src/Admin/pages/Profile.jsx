import { LuFileText } from "react-icons/lu";
import { PiUser } from "react-icons/pi";
import { IoKey } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { TbEdit } from "react-icons/tb";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser, updateUser } from "../Redux/Slices/authSlice";
import { toast } from "react-toastify";

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

function Profile() {
  const [active, setActive] = useState("Profile");
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bar = [
    {
      title: "Profile",
      icon: <PiUser />,
    },
    {
      title: "Login Activities",
      icon: <LuFileText />,
    },
    {
      title: "Change Password",
      icon: <IoKey />,
    },
    {
      title: "Logout From Other Devices",
      icon: <CiLogout />,
    },
  ];

  const handleSidebarClick = async (title) => {
    if (title === "Logout From Other Devices") {
      await dispatch(logoutUser());
      navigate("/");
      return;
    }
    setActive(title);
  };

  return (
    <div className="flex items-center justify-center gap-5 mt-12 px-4">
      <div className="flex flex-col items-center justify-center w-1/3 min-w-[240px] py-4 gap-2 shadow-lg p-8 bg-white">
        <img
          src={user?.avatar || DEFAULT_AVATAR}
          alt={user?.name || "profile"}
          className="h-20 w-20 rounded-full -mt-12 object-cover border"
        />
        <h3 className="font-semibold text-base capitalize">
          {user?.name || "—"}
        </h3>
        <h3 className="font-medium text-sm">{user?.email || "—"}</h3>
        <ul className="mt-8 w-full space-y-1">
          {bar.map((item) => (
            <li
              key={item.title}
              className={`py-2 hover:bg-blue-50 transition-all ${
                active === item.title && "bg-blue-200"
              } px-2 cursor-pointer rounded-md text-blue-500 flex items-center justify-start gap-3`}
              onClick={() => handleSidebarClick(item.title)}
            >
              <span>{item.icon}</span>
              <p>{item.title}</p>
            </li>
          ))}
        </ul>
      </div>
      <ProfilePanel
        user={user}
        active={active}
        loading={loading}
        dispatch={dispatch}
      />
    </div>
  );
}

export default Profile;

const ProfilePanel = function ({ user, active, loading, dispatch }) {
  if (active === "Change Password") {
    return <ChangePasswordForm loading={loading} dispatch={dispatch} />;
  }

  if (active === "Login Activities") {
    return (
      <div className="p-8 grow shadow-md bg-white flex items-center justify-center text-slate-500">
        <p>Login activities are not tracked yet</p>
      </div>
    );
  }

  if (active !== "Profile") {
    return (
      <div className="p-8 grow shadow-md bg-white flex items-center justify-center text-slate-500">
        <p className="capitalize">{active} coming soon</p>
      </div>
    );
  }

  return <ProfileBasic user={user} loading={loading} dispatch={dispatch} />;
};

const ProfileBasic = function ({ user, loading, dispatch }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user]);

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
    });
    setEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.warn("Name and email are required");
      return;
    }
    try {
      await dispatch(
        updateUser({
          name: form.name.trim(),
          email: form.email.trim(),
        })
      ).unwrap();
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      toast.error(err?.msg || "Failed to update profile");
    }
  };

  return (
    <div className="p-2 grow shadow-md bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b mb-3">
        <h2 className="capitalize font-bold text-lg">personal information</h2>
        {!editing ? (
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-black text-white px-3 py-2 rounded-md capitalize"
            onClick={() => setEditing(true)}
          >
            <span>edit</span>
            <span>
              <TbEdit />
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-2 rounded-md border capitalize text-sm"
              onClick={handleCancel}
              disabled={loading}
            >
              cancel
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded-md bg-black text-white capitalize text-sm disabled:opacity-60"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "saving..." : "save"}
            </button>
          </div>
        )}
      </div>

      <h1 className="bg-slate-100 font-medium text-base capitalize py-1 px-1 text-black w-full">
        basics
      </h1>

      {editing ? (
        <form onSubmit={handleSave} className="w-11/12 mx-auto mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1 capitalize">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-slate-50"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1 capitalize">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-slate-50"
              placeholder="Your email"
            />
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-center justify-between w-11/12 mx-auto mt-5 font-medium text-slate-500">
            <p className="capitalize w-1/2">Name </p>
            <p className="text-start w-1/2 capitalize">{user?.name || "—"}</p>
          </div>
          <div className="flex items-center justify-between w-11/12 mx-auto mt-5 font-medium text-slate-500">
            <p className="capitalize w-1/2">Email </p>
            <p className="self-start w-1/2 text-start">{user?.email || "—"}</p>
          </div>
        </>
      )}

      <div className="flex items-center justify-between w-11/12 mx-auto mt-5 font-medium text-slate-500">
        <p className="capitalize w-1/2">User </p>
        <p className="self-start w-1/2 text-start capitalize">
          {user?.admin ? "Admin" : "User"}
        </p>
      </div>
      <div className="flex items-center justify-between w-11/12 mx-auto mt-5 font-medium text-slate-500">
        <p className="capitalize w-1/2">Account ID</p>
        <p className="self-start w-1/2 text-start break-all text-sm">
          {user?.id || user?._id || "—"}
        </p>
      </div>
    </div>
  );
};

const ChangePasswordForm = function ({ loading, dispatch }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword) {
      toast.warn("Please fill all password fields");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.warn("New passwords do not match");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.warn("New password must be at least 6 characters");
      return;
    }
    try {
      await dispatch(
        updateUser({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        })
      ).unwrap();
      toast.success("Password updated successfully");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err?.msg || "Failed to update password");
    }
  };

  return (
    <div className="p-6 grow shadow-md bg-white">
      <h2 className="capitalize font-bold text-lg border-b pb-3 mb-4">
        change password
      </h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Current password
          </label>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, currentPassword: e.target.value }))
            }
            className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            New password
          </label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, newPassword: e.target.value }))
            }
            className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Confirm new password
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
            className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-400 bg-slate-50"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-md capitalize disabled:opacity-60"
        >
          {loading ? "updating..." : "update password"}
        </button>
      </form>
    </div>
  );
};
