import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Package } from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

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
          Thank you for shopping with us. We&apos;ll send you an update when your order ships.
        </p>
        <Link
          to={orderId ? `/track-order/${orderId}` : "/"}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-red-700 transition shadow-lg"
        >
          <Package className="w-6 h-6" />
          Track Order
        </Link>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-red-600 font-medium"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}
