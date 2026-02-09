import { Link } from "react-router-dom";
import { RotateCcw, FileCheck, Clock, AlertCircle } from "lucide-react";

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600">Home</Link>
            {" / "}
            <span className="text-gray-900 font-semibold">Returns</span>
          </p>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Returns & Refunds</h1>
          <p className="text-gray-600">
            Our return policy and how to request a refund or exchange.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <RotateCcw className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Return Policy</h2>
            </div>
            <p className="text-gray-600 mb-4">
              We want you to be completely satisfied with your purchase. If you are not happy with your order, you may return eligible items within 30 days of delivery for a refund or exchange.
            </p>
            <p className="text-gray-600">
              Items must be unused, in original packaging, and in resalable condition. Footwear should not show signs of wear. Please keep your receipt or order confirmation.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">How to Return</h2>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Contact our customer service or visit the Returns page in your account to start a return.</li>
              <li>Receive a return authorization and instructions (e.g., return label or drop-off location).</li>
              <li>Pack the item securely in its original packaging if possible.</li>
              <li>Ship or drop off the item as instructed.</li>
              <li>Once we receive and inspect the item, we will process your refund or exchange.</li>
            </ol>
          </section>

          <section className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Refund Timeline</h2>
            </div>
            <p className="text-gray-600">
              Refunds are processed within 5–10 business days after we receive your return. The refund will be credited to your original payment method. Depending on your bank or card issuer, it may take a few additional days for the amount to appear in your account.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Non-Returnable Items</h2>
            </div>
            <p className="text-gray-600">
              Certain items may not be eligible for return (e.g., personalized or sale items as specified at checkout). If you have questions about whether your item can be returned, please <Link to="/contact" className="text-red-600 hover:underline">contact us</Link> before sending it back.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
