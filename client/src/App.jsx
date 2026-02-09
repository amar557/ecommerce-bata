import Dashboard from "./Admin/pages/Dashboard";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LayOut from "./Admin/pages/LayOut";
import Profile from "./Admin/pages/Profile";
import Orders from "./Admin/pages/Orders";
import AllProucts from "./Admin/pages/AllProducts";
import AddProduct from "./Admin/pages/AddProduct";
import Categories from "./Admin/pages/Categories";
import Brands from "./Admin/pages/Brands";
import Customers from "./Admin/pages/Customers";
import AddCustomer from "./Admin/pages/AddCustomer";
import Login from "./Admin/pages/Login";
import { useEffect, useState } from "react";
import UpdateCategory from "./Admin/pages/UpdateCategory";
import UpdateBrand from "./Admin/pages/UpdateBrand";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserLayout from "./User/pages/UserLayout";
import Home from "./User/pages/Home";
import UpdateItem from "./Admin/pages/UpdataItem";
import ProductsPage from "./User/pages/products";
import ProductDetailsPage from "./User/pages/productDetails";
import Cart from "./User/pages/cart";
import CheckoutPage from "./User/pages/checkout";
import OrderSuccess from "./User/pages/OrderSuccess";
import TrackOrder from "./User/pages/TrackOrder";
import ContactUs from "./User/pages/ContactUs";
import ShippingInfo from "./User/pages/ShippingInfo";
import Returns from "./User/pages/Returns";
import { useDispatch } from "react-redux";
import { checkTokenExpiration } from "./Admin/Redux/Slices/authSlice";

function App() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("admin"));
  useEffect(() => {
    setIsAdmin(localStorage.getItem("admin"));
  }, []);

  
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('checking')
    dispatch(checkTokenExpiration());
    console.log('checking 2')
  }, [dispatch]);

  return (
    // <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/track-order/:orderId" element={<TrackOrder />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/shipping" element={<ShippingInfo />} />
            <Route path="/returns" element={<Returns />} />
          </Route>
          <Route path="admin" element={<LayOut />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="all-products" element={<AllProucts />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="update-product/:id" element={<UpdateItem />} />
            <Route path="categories" element={<Categories />} />
            <Route path="update/category/:id" element={<UpdateCategory />} />
            <Route path="brands" element={<Brands />} />
            <Route path="update/brand/:id" element={<UpdateBrand />} />
            <Route path="customers" element={<Customers />} />
            <Route path="addcustomer" element={<AddCustomer />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="login" element={<Login />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    // </Provider>
  );
}

export default App;
