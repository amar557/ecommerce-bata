import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ChevronRight, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { fetchBestSellers } from "../../Admin/Redux/Slices/productSlice";
import { getCategories } from "../../Admin/Redux/Async/Asynch";
import { useNavigationController } from "../../constants/navigation";
import { ProductCard } from "./products";

const FALLBACK_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop";

// Hero Banner Component
const HeroBanner = () => {
  return (
    <section className="relative bg-gradient-to-r from-deepRed-600 to-deepRed-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold">New Collection 2025</span>
            </div>
            <h2 className="text-5xl font-bold mb-4">Step into Style</h2>
            <p className="text-xl mb-8 text-deepRed-100">
              Discover the perfect pair for every occasion. Quality footwear
              since 1894.
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-deepRed-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                Shop Now
              </button>
              <button className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-deepRed-600 transition">
                View Collection
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop"
              alt="Featured Shoes"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Category Card Component
const CategoryCard = ({ category }) => {
  return (
    <Link to={category.link} className="group block h-full">
      <div className="relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 h-full">
        <img
          src={category.image || FALLBACK_CATEGORY_IMAGE}
          alt={category.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_CATEGORY_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 w-full">
            <h3 className="text-2xl font-bold text-white mb-2 capitalize">
              {category.name}
            </h3>
            <div className="flex items-center text-white">
              <span className="text-sm">Explore Collection</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const CategoryCarousel = ({ categories }) => {
  // Duplicate slides when few items so Swiper loop stays infinite
  const slides =
    categories.length > 0 && categories.length < 8
      ? [...categories, ...categories]
      : categories;

  return (
    <div className="relative category-swiper px-6 md:px-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        loop
        speed={600}
        spaceBetween={24}
        slidesPerView={2}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          768: { slidesPerView: 4, spaceBetween: 24 },
        }}
        pagination={{
          clickable: true,
          el: ".category-swiper-pagination",
          bulletClass: "category-swiper-bullet",
          bulletActiveClass: "category-swiper-bullet-active",
        }}
        navigation={{
          prevEl: ".category-swiper-prev",
          nextEl: ".category-swiper-next",
        }}
      >
        {slides.map((category, index) => (
          <SwiperSlide key={`${category.id || category.name}-${index}`}>
            <CategoryCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        aria-label="Previous categories"
        className="category-swiper-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 h-10 w-10 rounded-full bg-white shadow-md border flex items-center justify-center text-gray-800 hover:bg-gray-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        aria-label="Next categories"
        className="category-swiper-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 h-10 w-10 rounded-full bg-white shadow-md border flex items-center justify-center text-gray-800 hover:bg-gray-50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="category-swiper-pagination flex items-center justify-center gap-2 mt-6" />

      <style>{`
        .category-swiper-bullet {
          display: inline-block;
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 9999px;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .category-swiper-bullet:hover {
          background: #9ca3af;
        }
        .category-swiper-bullet-active {
          width: 1.5rem;
          background: #7A0A0A;
        }
      `}</style>
    </div>
  );
};

// Categories Section Component
const CategoriesSection = ({ categories, loading }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h2>
        <p className="text-gray-600 text-lg">
          Find your perfect fit from our diverse collection
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No categories available
        </p>
      ) : (
        <CategoryCarousel categories={categories} />
      )}
    </section>
  );
};

// Products Section Component — Swiper of top 5 best sellers
const ProductsSection = ({ products, loading }) => {
  const { navigateTo } = useNavigationController();

  const slides =
    products.length > 0 && products.length < 8
      ? [...products, ...products]
      : products;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Best Sellers
        </h2>
        <p className="text-gray-600 text-lg">Our top 5 bestsellers right now</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : products && products.length > 0 ? (
        <div className="relative product-swiper px-6 md:px-8">
          <button
            type="button"
            aria-label="Previous products"
            className="product-swiper-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 h-10 w-10 rounded-full bg-white shadow-md border flex items-center justify-center text-gray-800 hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <Swiper
            modules={[Navigation, Pagination, Autoplay, A11y]}
            loop
            speed={600}
            spaceBetween={24}
            slidesPerView={2}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            pagination={{
              clickable: true,
              el: ".product-swiper-pagination",
              bulletClass: "product-swiper-bullet",
              bulletActiveClass: "product-swiper-bullet-active",
            }}
            navigation={{
              prevEl: ".product-swiper-prev",
              nextEl: ".product-swiper-next",
            }}
          >
            {slides.map((product, index) => (
              <SwiperSlide key={`${product._id}-${index}`}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            aria-label="Next products"
            className="product-swiper-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 h-10 w-10 rounded-full bg-white shadow-md border flex items-center justify-center text-gray-800 hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="product-swiper-pagination flex items-center justify-center gap-2 mt-6" />

          <style>{`
            .product-swiper-bullet {
              display: inline-block;
              width: 0.625rem;
              height: 0.625rem;
              border-radius: 9999px;
              background: #d1d5db;
              cursor: pointer;
              transition: all 0.2s ease;
            }
            .product-swiper-bullet:hover {
              background: #9ca3af;
            }
            .product-swiper-bullet-active {
              width: 1.5rem;
              background: #7A0A0A;
            }
          `}</style>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg py-20">
          No products found 😔
        </div>
      )}

      <div className="text-center mt-12">
        <button
          className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition font-semibold"
          onClick={() => navigateTo("/products")}
        >
          View All Products
        </button>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    { icon: "🚚", title: "Free Shipping", desc: "On orders above PKR 999" },
    { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
    { icon: "✓", title: "Quality Assured", desc: "100% authentic products" },
    { icon: "💳", title: "Secure Payment", desc: "Safe & secure checkout" },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function BataLandingPage() {
  const dispatch = useDispatch();

  const { bestSellers, bestSellersLoading } = useSelector(
    (state) => state.products
  );
  const { categories: rawCategories, loading: categoriesLoading } = useSelector(
    (state) => state.Categories
  );

  useEffect(() => {
    dispatch(fetchBestSellers(5));
    dispatch(getCategories());
  }, [dispatch]);

  const categories = (rawCategories || []).map((cat) => ({
    id: cat._id,
    name: cat.category,
    image: cat.image || FALLBACK_CATEGORY_IMAGE,
    link: `/products?category=${encodeURIComponent(cat.category)}`,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner />
      <CategoriesSection categories={categories} loading={categoriesLoading} />
      <ProductsSection
        products={bestSellers}
        loading={bestSellersLoading}
      />
      <FeaturesSection />
    </div>
  );
}
