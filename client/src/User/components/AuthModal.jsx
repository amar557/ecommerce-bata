import { useState } from "react";
import { PiX } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../Admin/Redux/Slices/authSlice";

function AuthModal({ isOpen, onClose, mode, onSwitchMode }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formError, setFormError] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      if (mode === "signup") {
        const resultAction = await dispatch(
          registerUser({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          })
        );

        if (registerUser.fulfilled.match(resultAction)) {
          // Check if the response actually indicates an error
          if (
            resultAction.payload?.msg &&
            resultAction.payload.msg.toLowerCase().includes("error")
          ) {
            throw new Error(resultAction.payload.msg);
          }
          console.log("✅ Signup successful:", resultAction.payload);
          alert("Signup successful!");
          onClose();
        } else {
          throw new Error(resultAction.payload || "Signup failed");
        }
      } else {
        const resultAction = await dispatch(
          loginUser({
            email: formData.email,
            password: formData.password,
          })
        );

        if (loginUser.fulfilled.match(resultAction)) {
          // Check if the payload contains an error message
          const payload = resultAction.payload;

          if (
            payload?.msg &&
            (payload.msg.toLowerCase().includes("incorrect") ||
              payload.msg.toLowerCase().includes("invalid") ||
              payload.msg.toLowerCase().includes("not found") ||
              payload.msg.toLowerCase().includes("failed"))
          ) {
            throw new Error(payload.msg);
          }

          console.log("✅ Login successful:", resultAction.payload);
          alert("Login successful!");
          onClose();
        } else {
          throw new Error(resultAction.payload || "Login failed");
        }
      }

      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setFormError(err.message);
    }
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
        >
          <PiX />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center capitalize">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="••••••••"
                />
              </div>
            )}

            {(formError || error) && (
              <div className="text-deepRed-600 text-sm bg-deepRed-50 p-3 rounded-md">
                {formError || error?.msg || (typeof error === "string" ? error : "Something went wrong")}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : mode === "signin"
                ? "Sign In"
                : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {mode === "signin"
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              onClick={onSwitchMode}
              className="text-black font-medium hover:underline"
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
