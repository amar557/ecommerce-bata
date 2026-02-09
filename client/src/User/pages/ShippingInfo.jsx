import { Link } from "react-router-dom";
import { Truck, Package, Clock, MapPin } from "lucide-react";

export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600">Home</Link>
            {" / "}
            <span className="text-gray-900 font-semibold">Shipping Info</span>
          </p>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Information</h1>
          <p className="text-gray-600">
            Everything you need to know about delivery times and options.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Delivery Options</h2>
            </div>
            <p className="text-gray-600 mb-4">
              We offer standard and express shipping across Pakistan. Orders are processed within 1–2 business days after confirmation.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li><strong className="text-gray-900">Standard delivery:</strong> 5–7 business days</li>
              <li><strong className="text-gray-900">Express delivery:</strong> 2–3 business days (where available)</li>
              <li><strong className="text-gray-900">Free shipping:</strong> On orders above a minimum threshold (see checkout for details)</li>
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Order Processing</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Once your order is placed, you will receive an email confirmation. We will notify you again when your order has been shipped, along with tracking details if available.
            </p>
            <p className="text-gray-600">
              Please ensure your shipping address is correct at checkout. We are not responsible for delays or failed delivery due to incorrect or incomplete addresses.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Delivery Timeframes</h2>
            </div>
            <p className="text-gray-600">
              Delivery times are estimates and may vary depending on your location and courier availability. Public holidays and unforeseen circumstances may cause delays. We will keep you updated if there are any changes to your delivery.
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-8 h-8 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Shipping Areas</h2>
            </div>
            <p className="text-gray-600">
              We currently ship to addresses within Pakistan. If you have questions about delivery to your area or need special arrangements, please <Link to="/contact" className="text-red-600 hover:underline">contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
