import express from "express";
import {
  ListCategories,
  deleteCategory,
  getAllBrands,
  getAllCategories,
  listBrands,
  updateCategory,
  deleteBrand,
  getSingleCategory,
  getSingleBrand,
  updateBrand,
  ListAccessories,
  getAllAccessories,
  getSingleAccessory,
  updateAccessory,
  deleteAccessory,
} from "../controller/Categories.js";
import {
  listbrand,
  listCategory,
  listAccessory,
  validate,
} from "../validator/Categories.validate.js";

const Categories = express.Router();

Categories.post("/list/category", validate(listCategory), ListCategories);
Categories.get("/get/categories", getAllCategories);
Categories.get("/get/category/:id", getSingleCategory);
Categories.delete("/delete/category/:id", deleteCategory);
Categories.put("/update/category/:id", validate(listCategory), updateCategory);
Categories.get("/get/brands", getAllBrands);
Categories.post("/list/brand", validate(listbrand), listBrands);
Categories.get("/get/brand/:id", getSingleBrand);
Categories.put("/update/brand/:id", updateBrand);
Categories.delete("/delete/brand/:id", deleteBrand);
Categories.post("/list/accessory", validate(listAccessory), ListAccessories);
Categories.get("/get/accessories", getAllAccessories);
Categories.get("/get/accessory/:id", getSingleAccessory);
Categories.put("/update/accessory/:id", validate(listAccessory), updateAccessory);
Categories.delete("/delete/accessory/:id", deleteAccessory);
export default Categories;
