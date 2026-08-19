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
import { toast } from "react-toastify";
import axiosInstance from "../../constants/axiosInstance";

function formatSummaryDefault() {
  return {
    total: 0,
    average: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };
}

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
                ? "border-deepRed-600"
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
  ratingSummary,
}) => {
  const {navigateTo}=useNavigationController()
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth);
  const average = ratingSummary?.average || 0;
  const totalReviews = ratingSummary?.total || 0;
  const filledStars = Math.round(average);
  
  const updateQuantity = async (cartItemId, newQuantity, sizeId) => {
    // Check if user is logged in
    if (!user || !user.name) {
      toast.warning("You are not logged in. Please login to add items to cart.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    if (newQuantity < 1) return;
    
    try {
      await dispatch(addItemToCart({
        productId: cartItemId,
        quantity: newQuantity,
        selectedSizeId: sizeId || undefined,
      })).unwrap();
      toast.success("Item added to cart successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setQuantity(1);
      navigateTo('/cart');
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
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
        <a href="/" className="hover:text-deepRed-600">
          Home
        </a>{" "}
        /
        <a href="/products" className="hover:text-deepRed-600">
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
                i < filledStars
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-gray-600">
          ({average ? average.toFixed(1) : "0.0"})
        </span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-600">
          {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-4">
        {hasDiscount ? (
          <>
            <span className="text-4xl font-bold text-gray-900">
              PKR {product.discountPrice}
            </span>
            <span className="text-2xl text-gray-500 line-through">
              PKR {product.price}
            </span>
            <span className="bg-deepRed-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              Save {discountPercent}%
            </span>
          </>
        ) : (
          <span className="text-4xl font-bold text-gray-900">
            PKR {product.price}
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
            className="w-12 h-12 rounded-full border-4 border-deepRed-600 shadow-md"
            style={{ backgroundColor: product.color }}
          />
          <span className="text-gray-700">{product.color}</span>
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Select Size</h3>
          <button className="text-sm text-deepRed-600 hover:text-deepRed-700 font-semibold">
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
                  ? "border-deepRed-600 bg-deepRed-50 text-deepRed-600"
                  : sizeObj.stock === 0
                  ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 hover:border-deepRed-600 text-gray-700"
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
          onClick={() => updateQuantity(product._id, quantity, selectedSize)}
          disabled={!selectedSize}
          className="flex-1 bg-deepRed-600 text-white py-4 rounded-lg font-semibold hover:bg-deepRed-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"

        >
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-4 border-2 border-gray-300 rounded-lg hover:border-deepRed-600 hover:bg-deepRed-50 transition"
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite ? "fill-deepRed-600 text-deepRed-600" : "text-gray-600"
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
          <Truck className="w-8 h-8 text-deepRed-600 mb-2" />
          <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
          <p className="text-xs text-gray-600">On orders above PKR 999</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <RotateCcw className="w-8 h-8 text-deepRed-600 mb-2" />
          <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
          <p className="text-xs text-gray-600">30-day return policy</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Shield className="w-8 h-8 text-deepRed-600 mb-2" />
          <p className="text-sm font-semibold text-gray-900">Authentic</p>
          <p className="text-xs text-gray-600">100% genuine products</p>
        </div>
      </div>
    </div>
  );
};

// Reviews Section Component
const ReviewsSection = ({ productId, onSummaryChange }) => {
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(
    token || localStorage.getItem("token") || user?.email || user?.name
  );

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(formatSummaryDefault());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const loadReviews = async (nextPage = 1, append = false) => {
    if (!productId) return;
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/api/item/${productId}/reviews`,
        { params: { page: nextPage, limit: 5 } }
      );
      const nextReviews = data?.reviews || [];
      setReviews((prev) => (append ? [...prev, ...nextReviews] : nextReviews));
      const nextSummary = data?.summary || formatSummaryDefault();
      setSummary(nextSummary);
      onSummaryChange?.(nextSummary);
      setPage(nextPage);
      setHasMore(Boolean(data?.pagination?.hasMore));
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to load reviews");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadReviews(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please log in to write a review.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a short review comment.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axiosInstance.post(
        `/api/item/${productId}/reviews`,
        { rating, comment: comment.trim() }
      );
      toast.success(data?.msg || "Review submitted");
      setComment("");
      setRating(5);
      await loadReviews(1, false);
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const total = summary.total || 0;
  const average = summary.average || 0;
  const distribution = summary.distribution || formatSummaryDefault().distribution;
  const filledAvgStars = Math.round(average);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Customer Reviews
      </h2>

      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-8 mb-8 pb-6 border-b">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900">
            {total ? average.toFixed(1) : "0.0"}
          </div>
          <div className="flex items-center justify-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < filledAvgStars
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {total} {total === 1 ? "Review" : "Reviews"}
          </p>
        </div>

        <div className="flex-1 space-y-2 w-full">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const pct = total ? Math.round((count / total) * 100) : 0;
            return (
              <div key={star} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-12">{star} star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write a review */}
      <form onSubmit={handleSubmit} className="mb-8 pb-6 border-b space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Write a review</h3>
        {!isLoggedIn ? (
          <p className="text-sm text-gray-600">
            Please log in to share your experience with this product.
          </p>
        ) : (
          <>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Your rating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-0.5"
                      aria-label={`${star} star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          active
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label
                htmlFor="review-comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your review
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Tell others what you think about this product..."
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-deepRed-600"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-deepRed-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-deepRed-700 transition disabled:opacity-70"
            >
              {submitting ? "Submitting..." : "Submit review"}
            </button>
          </>
        )}
      </form>

      {/* Individual Reviews */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600">
          No reviews yet. Be the first to review this product.
        </p>
      ) : (
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
      )}

      {hasMore && (
        <button
          type="button"
          disabled={loadingMore}
          onClick={() => loadReviews(page + 1, true)}
          className="w-full mt-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-deepRed-600 hover:text-deepRed-600 transition disabled:opacity-70"
        >
          {loadingMore ? "Loading..." : "Load More Reviews"}
        </button>
      )}
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
        <p className="text-deepRed-500">Failed to load suggestions: {error}</p>
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
  const [ratingSummary, setRatingSummary] = useState(formatSummaryDefault());
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
      toast.warning("Please select a size before adding to cart.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setCartCount(cartCount + quantity);
    toast.success(`Added ${quantity} item(s) to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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
        <p className="text-deepRed-500 font-semibold">
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
            ratingSummary={ratingSummary}
          />
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <ReviewsSection productId={id} onSummaryChange={setRatingSummary} />
        </div>

        {/* Related Products */}
        <RelatedProducts />
      </div>
    </div>
  );
}
