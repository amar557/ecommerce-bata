import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  User,
  Search,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  Plus,
  Share2,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../Admin/Redux/Slices/productSlice";
import { fetchSuggestedItems } from "../../Admin/Redux/Slices/suggestedSlice";
import { ProductCard } from "./products";
import { addItemToCart } from "../../Admin/Redux/Slices/cartSlice";
import { useNavigationController } from "../../constants/navigation";

// Image Gallery Component
const ImageGallery = ({ images, thumbnailImage }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const allImages = [thumbnailImage, ...images];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-gray-100 rounded-xl overflow-hidden group">
        <img
          src={allImages[selectedImage]}
          alt="Product"
          className="w-full h-96 lg:h-[500px] object-cover"
        />

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {selectedImage + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-3">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`border-2 rounded-lg overflow-hidden transition ${
              selectedImage === index
                ? "border-red-600"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-20 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// Product Info Component
const ProductInfo = ({
  product,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  addToCart,
}) => {
  const {navigateTo}=useNavigationController()
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch()
    const updateQuantity = (cartItemId, newQuantity) => {
      if (newQuantity < 1) return;
      dispatch(addItemToCart({ productId: cartItemId, quantity: newQuantity }));
      setQuantity(1)
      navigateTo('/cart')
    };
  
  const hasDiscount = product.offer && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <a href="/" className="hover:text-red-600">
          Home
        </a>{" "}
        /
        <a href="/products" className="hover:text-red-600">
          {" "}
          Products
        </a>{" "}
        /<span className="text-gray-900 font-semibold"> {product.title}</span>
      </div>

      {/* Brand */}
      <div>
        <p className="text-sm text-gray-500 uppercase tracking-wide">
          {product.brandId.brand}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mt-1">
          {product.title}
        </h1>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-gray-600">(4.5)</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-600">128 Reviews</span>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-4">
        {hasDiscount ? (
          <>
            <span className="text-4xl font-bold text-gray-900">
              ₹{product.discountPrice}
            </span>
            <span className="text-2xl text-gray-500 line-through">
              ₹{product.price}
            </span>
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              Save {discountPercent}%
            </span>
          </>
        ) : (
          <span className="text-4xl font-bold text-gray-900">
            ₹{product.price}
          </span>
        )}
      </div>

      {/* Category & Gender */}
      <div className="flex items-center space-x-4 text-sm">
        <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
          {product.categoryId.category}
        </span>
        <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 capitalize">
          {product.gender}
        </span>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Color */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-full border-4 border-red-600 shadow-md"
            style={{ backgroundColor: product.color }}
          />
          <span className="text-gray-700">{product.color}</span>
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Select Size</h3>
          <button className="text-sm text-red-600 hover:text-red-700 font-semibold">
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {product.sizes.map((sizeObj, index) => (
            <button
              key={index}
              onClick={() => setSelectedSize(sizeObj._id)}
              disabled={sizeObj.stock === 0}
              className={`py-3 px-4 border-2 rounded-lg font-semibold transition ${
                selectedSize === sizeObj._id
                  ? "border-red-600 bg-red-50 text-red-600"
                  : sizeObj.stock === 0
                  ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 hover:border-red-600 text-gray-700"
              }`}
            >
              {sizeObj.size}
              {sizeObj.stock === 0 && (
                <span className="block text-xs mt-1">Out</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border-2 border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 hover:bg-gray-100 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-6 font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-3 hover:bg-gray-100 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-gray-600">
            {product.sizes.find((s) => s._id === selectedSize)?.stock || 0}{" "}
            items available
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={()=>updateQuantity(product._id,quantity)}
          disabled={!selectedSize}
          className="flex-1 bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"

        >
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-4 border-2 border-gray-300 rounded-lg hover:border-red-600 hover:bg-red-50 transition"
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite ? "fill-red-600 text-red-600" : "text-gray-600"
            }`}
          />
        </button>
        <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition">
          <Share2 className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t">
        <div className="flex flex-col items-center text-center">
          <Truck className="w-8 h-8 text-red-600 mb-2" />
          <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
          <p className="text-xs text-gray-600">On orders above ₹999</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <RotateCcw className="w-8 h-8 text-red-600 mb-2" />
          <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
          <p className="text-xs text-gray-600">30-day return policy</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Shield className="w-8 h-8 text-red-600 mb-2" />
          <p className="text-sm font-semibold text-gray-900">Authentic</p>
          <p className="text-xs text-gray-600">100% genuine products</p>
        </div>
      </div>
    </div>
  );
};

// Reviews Section Component
const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Rajesh Kumar",
      rating: 5,
      date: "2 days ago",
      comment:
        "Excellent quality! Very comfortable and looks great. Highly recommended!",
      verified: true,
    },
    {
      id: 2,
      name: "Priya Singh",
      rating: 4,
      date: "1 week ago",
      comment: "Good product. Fits perfectly. Delivery was fast too.",
      verified: true,
    },
    {
      id: 3,
      name: "Amit Sharma",
      rating: 5,
      date: "2 weeks ago",
      comment: "Best shoes I've bought online. Worth every penny!",
      verified: true,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Customer Reviews
      </h2>

      {/* Rating Summary */}
      <div className="flex items-center space-x-8 mb-8 pb-6 border-b">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900">4.5</div>
          <div className="flex items-center justify-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">128 Reviews</p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 w-12">{rating} star</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{
                    width: `${rating === 5 ? 70 : rating === 4 ? 20 : 10}%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12">
                {rating === 5 ? 90 : rating === 4 ? 26 : 12}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  {review.verified && (
                    <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      <Check className="w-3 h-3 mr-1" />
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-red-600 hover:text-red-600 transition">
        Load More Reviews
      </button>
    </div>
  );
};

// Related Products Component
const RelatedProducts = () => {
  const [cartCount, setCartCount] = useState(0);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.suggested);
  const { id: productId } = useParams();

  const addToCart = (productId) => {
    setCartCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (productId) {
      dispatch(fetchSuggestedItems(productId));
    }
  }, [productId, dispatch]);

  // 🌀 Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500 animate-pulse">Loading suggestions...</p>
      </div>
    );
  }

  // ❌ Error State
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-red-500">Failed to load suggestions: {error}</p>
      </div>
    );
  }

  // 🚫 No Suggestions
  if (!data || data.length === 0) {
    return null; // or show a message like: <p>No related products found.</p>
  }

  // ✅ Render suggestions
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((product) => (
          <ProductCard key={product._id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

// Main Product Details Page
export default function ProductDetailsPage() {
  const [cartCount, setCartCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();

  const dispatch = useDispatch();
  const { singleProduct, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [id]);

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    setCartCount(cartCount + quantity);
    alert(`Added ${quantity} item(s) to cart!`);
  };

  // Show loader while product is loading
  if (loading || !singleProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-primaryTeal rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 font-semibold">
          Failed to load product details. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Details Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <ImageGallery
            images={singleProduct?.images}
            thumbnailImage={singleProduct?.thumbnailImage}
          />
          <ProductInfo
            product={singleProduct}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
            addToCart={addToCart}
          />
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <ReviewsSection />
        </div>

        {/* Related Products */}
        <RelatedProducts />
      </div>
    </div>
  );
}
