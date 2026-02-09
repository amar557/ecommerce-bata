import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, TrendingUp, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../Admin/Redux/Slices/productSlice";
import { useNavigationController } from "../../constants/navigation";
import { ProductCard } from "./products";

// Hero Banner Component
const HeroBanner = () => {
  return (
    <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold">New Collection 2025</span>
            </div>
            <h2 className="text-5xl font-bold mb-4">Step into Style</h2>
            <p className="text-xl mb-8 text-red-100">
              Discover the perfect pair for every occasion. Quality footwear
              since 1894.
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                Shop Now
              </button>
              <button className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-red-600 transition">
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
    <Link to={category.link} className="group block">
      <div className="relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 w-full">
            <h3 className="text-2xl font-bold text-white mb-2">
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

// Categories Section Component
const CategoriesSection = ({ categories }) => {
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={index} category={category} />
        ))}
      </div>
    </section>
  );
};

// Product Card Component
// const ProductCard = ({ product, addToCart }) => {
//   const [isFavorite, setIsFavorite] = useState(false);

//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300">
//       <div className="relative overflow-hidden">
//         <img
//           src={product.thumbnailImage}
//           alt={product.name}
//           className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
//         />
//         <button
//           onClick={() => setIsFavorite(!isFavorite)}
//           className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
//         >
//           <Heart
//             className={`w-5 h-5 ${
//               isFavorite ? "fill-red-600 text-red-600" : "text-gray-600"
//             }`}
//           />
//         </button>
//         {product?.category && (
//           <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
//             {product.category}
//           </span>
//         )}
//       </div>

//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">
//           {product.title}
//         </h3>

//         <div className="flex items-center mb-3">
//           <div className="flex items-center">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 className={`w-4 h-4 ${
//                   i < Math.floor(product.rating)
//                     ? "fill-yellow-400 text-yellow-400"
//                     : "text-gray-300"
//                 }`}
//               />
//             ))}
//           </div>
//           <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
//         </div>

//         <div className="flex items-center justify-between">
//           <span className="text-2xl font-bold text-gray-900">
//             ₹{product.price}
//           </span>
//           <button
//             onClick={() => addToCart(product._id)}
//             className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition font-semibold"
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// Products Section Component
const ProductsSection = ({ products, addToCart, loading }) => {
    const { navigateTo, navigateBack } = useNavigationController();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Featured Products
        </h2>
        <p className="text-gray-600 text-lg">Handpicked styles just for you</p>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : products && products.length > 0 ? (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center text-gray-500 text-lg py-20">
          No products found 😔
        </div>
      )}

      {/* Footer Button */}
      <div className="text-center mt-12">
        <button className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition font-semibold" onClick={()=>navigateTo('/products')}>
          View All Products
        </button>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹999" },
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


// Main App Component
export default function BataLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dispatch = useDispatch();

  const {
    items,
    loading: productLoading,
    error,
  } = useSelector((state) => state.products);
  console.log(items);
  useEffect(() => {
    dispatch(fetchProducts()); // You can pass gender if needed
  }, []);
  const categories = [
    {
      name: "Men",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      link: "/products?gender=male",
    },
    {
      name: "Women",
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop",
      link: "/products?gender=female",
    },
    {
      name: "Kids",
      image:
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop",
      link: "/products?gender=kids",
    },
    {
      name: "Sports",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      link: "/products?category=Sports",
    },
  ];



  const addToCart = (productId) => {
    setCartCount(cartCount + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header cartCount={cartCount} menuOpen={menuOpen} setMenuOpen={setMenuOpen} /> */}
      <HeroBanner />
      <CategoriesSection categories={categories} />
      <ProductsSection
        products={items}
        loading={productLoading}
        addToCart={addToCart}
      />
      <FeaturesSection />
    </div>
  );
}
