import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  X,
  Heart,
  Grid,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../Admin/Redux/Slices/productSlice";
import { useNavigationController } from "../../constants/navigation";
import { addItemToCart } from "../../Admin/Redux/Slices/cartSlice";
import { toast } from "react-toastify";


// Filter Sidebar Component – all options derived from fetched data
const FilterSidebar = ({
  filters,
  setFilters,
  brands,
  categories,
  accessories,
  colors,
  sizes,
  genderOptions,
  priceRanges,
  showMobileFilters,
  setShowMobileFilters,
}) => {

  const toggleFilter = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      brands: [],
      categories: [],
      accessories: [],
      colors: [],
      sizes: [],
      gender: [],
      priceRange: null,
      onlyOffers: false,
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-red-600 hover:text-red-700 font-semibold"
        >
          Clear All
        </button>
      </div>

      {/* Gender Filter */}
      {genderOptions?.length > 0 && (
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Gender</h4>
        <div className="space-y-2">
          {genderOptions.map((gender) => (
            <label
              key={gender}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.gender.includes(gender)}
                onChange={() => toggleFilter("gender", gender)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span className="text-gray-700 capitalize">{gender}</span>
            </label>
          ))}
        </div>
      </div>
      )}

      {/* Brand Filter */}
      {brands?.length > 0 && (
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Brand</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label
              key={brand._id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand._id)}
                onChange={() => toggleFilter("brands", brand._id)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span className="text-gray-700">{brand.brand}</span>
            </label>
          ))}
        </div>
      </div>
      )}

      {/* Category Filter */}
      {categories?.length > 0 && (
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category._id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category._id)}
                onChange={() => toggleFilter("categories", category._id)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span className="text-gray-700">{category.category}</span>
            </label>
          ))}
        </div>
      </div>
      )}

      {/* Accessory Filter */}
      {accessories?.length > 0 && (
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Accessory</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {accessories.map((acc) => (
            <label
              key={acc._id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.accessories.includes(acc._id)}
                onChange={() => toggleFilter("accessories", acc._id)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span className="text-gray-700">{acc.accessory}</span>
            </label>
          ))}
        </div>
      </div>
      )}

      {/* Color Filter */}
      {colors?.length > 0 && (
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Color</h4>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => toggleFilter("colors", color)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                filters.colors.includes(color)
                  ? "border-red-600 scale-110"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            >
              {filters.colors.includes(color) && (
                <span className="text-white text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Size Filter */}
      {sizes?.length > 0 && (
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Size</h4>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleFilter("sizes", size)}
              className={`py-2 px-3 border rounded-lg text-sm font-semibold transition ${
                filters.sizes.includes(size)
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Price Range Filter */}
      {priceRanges?.length > 0 && (
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <label
              key={index}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="priceRange"
                checked={
                  filters.priceRange?.min === range.min &&
                  filters.priceRange?.max === range.max
                }
                onChange={() =>
                  setFilters((prev) => ({ ...prev, priceRange: range }))
                }
                className="w-4 h-4 text-red-600"
              />
              <span className="text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
      )}

      {/* Offers Filter */}
      <div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyOffers}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, onlyOffers: e.target.checked }))
            }
            className="w-4 h-4 text-red-600 rounded"
          />
          <span className="text-gray-700 font-semibold">
            Special Offers Only
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
        <FilterContent />
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Product Card Component
export const ProductCard = ({ product }) => {
  const { navigateTo } = useNavigationController();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const addToCart = async (id) => {
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
    
    try {
      await dispatch(addItemToCart({ productId: id, quantity: 'up' })).unwrap();
      toast.success("Item added to cart successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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

  const [isFavorite, setIsFavorite] = useState(false);
  const hasDiscount = product.offer && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <img
          src={product.thumbnailImage || product.images[0]}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-600 text-red-600" : "text-gray-600"
            }`}
          />
        </button>

        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discountPercent}%
          </span>
        )}

        <span className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
          {product.categoryId.category}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.brandId.brand}</p>
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        <div className="flex items-center mb-2">
          <div
            className="w-4 h-4 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: product.color }}
            title={product.color}
          />
          <span className="ml-2 text-xs text-gray-500">
            {product.sizes?.length} sizes available
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {hasDiscount ? (
              <>
                <span className="text-xl font-bold text-gray-900">
                  ₹{product.discountPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ₹{product.price}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => addToCart(product._id)}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          Add to Cart
        </button>
        <button
          onClick={() => navigateTo(`/product/${product._id}`)}
          className="w-full bg-gray-800 text-white py-2 mt-2 rounded-lg hover:bg-gray-700 transition font-semibold"
        >
          View
        </button>
      </div>
    </div>
  );
};

// Main Products Page Component
export default function ProductsPage() {
  const [cartCount, setCartCount] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    brands: [],
    categories: [],
    accessories: [],
    colors: [],
    sizes: [],
    gender: [],
    priceRange: null,
    onlyOffers: false,
  });
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const {
    items: allProducts,
    loading: productLoading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

 // 🧠 Make sure products are always an array
const productsArray = Array.isArray(allProducts) ? allProducts : [];

// 🧩 Dynamic filter options derived from fetched products
const dynamicBrands = React.useMemo(() => {
  const seen = new Set();
  return productsArray
    .filter((p) => p.brandId?._id && !seen.has(p.brandId._id) && (seen.add(p.brandId._id), true))
    .map((p) => ({ _id: p.brandId._id, brand: p.brandId.brand || p.brand }));
}, [productsArray]);

const dynamicCategories = React.useMemo(() => {
  const seen = new Set();
  return productsArray
    .filter((p) => p.categoryId?._id && !seen.has(p.categoryId._id) && (seen.add(p.categoryId._id), true))
    .map((p) => ({ _id: p.categoryId._id, category: p.categoryId.category || p.category }));
}, [productsArray]);

const dynamicAccessories = React.useMemo(() => {
  const seen = new Set();
  return productsArray
    .filter(
      (p) =>
        p.accessoryId?._id &&
        !seen.has(p.accessoryId._id) &&
        (seen.add(p.accessoryId._id), true)
    )
    .map((p) => ({
      _id: p.accessoryId._id,
      accessory: p.accessoryId.accessory || p.accessory,
    }));
}, [productsArray]);

const dynamicColors = React.useMemo(() => {
  return [...new Set(productsArray.map((p) => p.color).filter(Boolean))];
}, [productsArray]);

const dynamicSizes = React.useMemo(() => {
  const sizes = productsArray.flatMap((p) => (p.sizes || []).map((s) => s?.size).filter(Boolean));
  return [...new Set(sizes)].sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return String(a).localeCompare(String(b));
  });
}, [productsArray]);

const dynamicGenders = React.useMemo(() => {
  return [...new Set(productsArray.map((p) => p.gender).filter(Boolean))];
}, [productsArray]);

const dynamicPriceRanges = React.useMemo(() => {
  const prices = productsArray.map((p) =>
    p.offer && p.discountPrice != null ? p.discountPrice : p.price
  ).filter((n) => typeof n === "number");
  if (prices.length === 0) return [];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return [{ label: `₹${min}`, min, max: Infinity }];
  const step = Math.max(1, Math.ceil((max - min) / 4));
  return [
    { label: `Under ₹${min + step}`, min: 0, max: min + step },
    { label: `₹${min + step} - ₹${min + step * 2}`, min: min + step, max: min + step * 2 },
    { label: `₹${min + step * 2} - ₹${min + step * 3}`, min: min + step * 2, max: min + step * 3 },
    { label: `Above ₹${min + step * 3}`, min: min + step * 3, max: Infinity },
  ];
}, [productsArray]);

// Sync filters from URL (navbar & links): ?gender=&category=&brand=&accessory=&offer=
useEffect(() => {
  const gender = searchParams.get("gender");
  const categoryName = searchParams.get("category");
  const brandName = searchParams.get("brand");
  const accessoryName = searchParams.get("accessory");
  const offerParam = searchParams.get("offer");

  if (
    !gender &&
    !categoryName &&
    !brandName &&
    !accessoryName &&
    offerParam == null
  ) {
    return;
  }

  setFilters((prev) => {
    const next = { ...prev };

    if (gender) {
      next.gender = [gender];
    } else {
      next.gender = [];
    }

    next.onlyOffers =
      offerParam === "true" || offerParam === "1";

    if (categoryName && dynamicCategories.length > 0) {
      const cat = dynamicCategories.find(
        (c) => c.category?.toLowerCase() === categoryName.toLowerCase()
      );
      next.categories = cat ? [cat._id] : [];
    } else if (!categoryName) {
      next.categories = [];
    }

    if (brandName && dynamicBrands.length > 0) {
      const b = dynamicBrands.find(
        (x) => x.brand?.toLowerCase() === brandName.toLowerCase()
      );
      next.brands = b ? [b._id] : [];
    } else if (!brandName) {
      next.brands = [];
    }

    if (accessoryName && dynamicAccessories.length > 0) {
      const a = dynamicAccessories.find(
        (x) => x.accessory?.toLowerCase() === accessoryName.toLowerCase()
      );
      next.accessories = a ? [a._id] : [];
    } else if (!accessoryName) {
      next.accessories = [];
    }

    return next;
  });
}, [searchParams, dynamicCategories, dynamicBrands, dynamicAccessories]);

// 🧩 Filter products safely
const filteredProducts = productsArray.filter((product) => {
  if (
    filters.brands.length > 0 &&
    !filters.brands.includes(product.brandId?._id)
  )
    return false;

  if (
    filters.categories.length > 0 &&
    !filters.categories.includes(product.categoryId?._id)
  )
    return false;

  if (
    filters.accessories.length > 0 &&
    !filters.accessories.includes(product.accessoryId?._id)
  )
    return false;

  if (filters.colors.length > 0 && !filters.colors.includes(product.color))
    return false;

  if (filters.gender.length > 0 && !filters.gender.includes(product.gender))
    return false;

  if (filters.onlyOffers && !product.offer) return false;

  if (filters.sizes.length > 0) {
    const hasSize = product.sizes?.some((s) =>
      filters.sizes.includes(s?.size || s?.title)
    );
    if (!hasSize) return false;
  }

  if (filters.priceRange) {
    const price = product.offer ? product.discountPrice : product.price;
    if (price < filters.priceRange.min || price > filters.priceRange.max)
      return false;
  }

  return true;
});

// 🧮 Sort safely
const sortedProducts = [...filteredProducts].sort((a, b) => {
  const priceA = a.offer ? a.discountPrice : a.price;
  const priceB = b.offer ? b.discountPrice : b.price;

  switch (sortBy) {
    case "price-low":
      return priceA - priceB;
    case "price-high":
      return priceB - priceA;
    case "newest":
      return new Date(b.createdAt) - new Date(a.createdAt);
    default:
      return 0;
  }
});


  const addToCart = (productId) => {
    setCartCount(cartCount + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            <a href="/" className="hover:text-red-600">
              Home
            </a>{" "}
            / <span className="text-gray-900 font-semibold">All Products</span>
          </p>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            Showing {sortedProducts.length} of {productsArray.length} products
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            brands={dynamicBrands}
            categories={dynamicCategories}
            accessories={dynamicAccessories}
            colors={dynamicColors}
            sizes={dynamicSizes}
            genderOptions={dynamicGenders}
            priceRanges={dynamicPriceRanges}
            showMobileFilters={showMobileFilters}
            setShowMobileFilters={setShowMobileFilters}
          />

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center space-x-2 text-gray-700 font-semibold"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                } gap-6`}
              >
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 mb-4">No products found</p>
                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                <button
                  onClick={() =>
                    setFilters({
                      brands: [],
                      categories: [],
                      accessories: [],
                      colors: [],
                      sizes: [],
                      gender: [],
                      priceRange: null,
                      onlyOffers: false,
                    })
                  }
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
