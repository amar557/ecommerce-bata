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
} from "../controller/Categories.js";
import {
  listbrand,
  listCategory,
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
export default Categories;
