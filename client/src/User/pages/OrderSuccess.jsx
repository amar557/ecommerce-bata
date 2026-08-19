import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { confirmStripePayment } from "../../Admin/Redux/Slices/cartSlice";
import { toast } from "react-toastify";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");

  const [orderId, setOrderId] = useState(orderIdParam);
  const [confirming, setConfirming] = useState(Boolean(sessionId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    async function confirm() {
      setConfirming(true);
      setError("");
      try {
        const result = await dispatch(confirmStripePayment(sessionId)).unwrap();
        if (!cancelled) {
          setOrderId(result?.orderId || null);
          toast.success("Payment successful!");
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err?.msg ||
            (typeof err === "string" ? err : "Failed to confirm Stripe payment");
          setError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setConfirming(false);
      }
    }
    confirm();
    return () => {
      cancelled = true;
    };
  }, [dispatch, sessionId]);

  if (confirming) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
          <Loader2 className="w-12 h-12 text-deepRed-600 animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Confirming your payment…
          </h1>
          <p className="text-gray-600">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment confirmation failed
          </h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="bg-deepRed-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-deepRed-700 transition"
          >
            Back to checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Your order is placed!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for shopping with us. We&apos;ll send you an update when
          your order ships.
        </p>
        <Link
          to={orderId ? `/track-order/${orderId}` : "/"}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-deepRed-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-deepRed-700 transition shadow-lg"
        >
          <Package className="w-6 h-6" />
          Track Order
        </Link>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-deepRed-600 font-medium"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}
