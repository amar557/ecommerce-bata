import Dashboard from "./Admin/pages/Dashboard";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LayOut from "./Admin/pages/LayOut";
import Profile from "./Admin/pages/Profile";
import Orders from "./Admin/pages/Orders";
import AllProucts from "./Admin/pages/AllProucts";
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
function App() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("admin"));
  useEffect(() => {
    setIsAdmin(localStorage.getItem("admin"));
  }, []);

  console.log(isAdmin);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="admin" element={<LayOut />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="all-products" element={<AllProucts />} />
          <Route path="add-product" element={<AddProduct />} />
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
      <ToastContainer autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;
