import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/logo2.png";
import axiosInstance from "../../constants/axiosInstance";

// Footer Component
const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      toast.error("Please enter your email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Please enter a valid email.");
      return;
    }

    setSubscribing(true);
    try {
      const { data } = await axiosInstance.post("/api/newsletter/subscribe", {
        email: value,
      });
      toast.success(data?.msg || "Subscribed successfully!");
      setEmail("");
    } catch (err) {
      toast.error(
        err?.response?.data?.msg ||
          err?.message ||
          "Failed to subscribe. Please try again."
      );
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="Bata" className="h-[4rem] w-auto mb-4" />
            <p className="text-gray-400">
              Quality footwear since 1894. Step into comfort and style.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/products?gender=male"
                  className="hover:text-white transition"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/products?gender=female"
                  className="hover:text-white transition"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/products?gender=kids"
                  className="hover:text-white transition"
                >
                  Kids
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Sports"
                  className="hover:text-white transition"
                >
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe for exclusive offers</p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-full text-gray-900 outline-none"
                disabled={subscribing}
              />
              <button
                type="submit"
                disabled={subscribing}
                className="bg-deepRed-600 px-6 py-2 rounded-r-full hover:bg-deepRed-700 transition disabled:opacity-70"
              >
                {subscribing ? "..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Bazar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
