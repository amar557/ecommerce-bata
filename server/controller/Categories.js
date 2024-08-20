import brandSchema from "../Schema/brandSchema.js";
import categorySchema from "../Schema/categorySchema.js";
import ListItem from "../Schema/ItemSchema.js";
export const ListCategories = async function (req, res, next) {
  const createdCat = await categorySchema(req.body);
  createdCat.save();
  res.status(200).send({ msg: createdCat });
};
export const listBrands = async function (req, res, next) {
  const createdBrand = await brandSchema(req.body);
  createdBrand.save();
  res.status(200).send({ msg: createdBrand });
};
export const listItem = async function (req, res, next) {
  const createdItem = await ListItem(req.body);
  createdItem.save();
  res.status(200).send({ msg: "item listed successfully" });
};

export const updateItem = async function (req, res, next) {
  const id = req.params.id;
  let item1 = req.body;
  const item = await ListItem.findByIdAndUpdate(id, item1, { new: true });
  res.status(200).send({ msg: "updated successfully" });
};
export const deleteItem = async function (req, res, next) {
  const id = req.params.id;
  let item1 = req.body;
  const item = await ListItem.findByIdAndDelete(id, item1, { new: true });
  res.status(200).send({ msg: "deleted successfully" });
};

export const getAllItems = async function (req, res, next) {
  const items = await ListItem.find();

  res.status(200).send(items);
};
export const getAllBrands = async function (req, res, next) {
  const brandsList = await brandSchema.find();
  res.status(200).send(brandsList);
};
export const getAllCategories = async function (req, res, next) {
  const categoriesList = await categorySchema.find();
  res.status(200).send(categoriesList);
};
export const getItem = async function (req, res, next) {
  const id = req.params.id;
  const item = await ListItem.findById(id);
  res.status(200).send(item);
};
export const deleteCategory = async function (req, res, next) {
  const id = req.params.id;
  const item = await categorySchema.findByIdAndDelete(id);
  res.status(200).send({ msg: "item deleted successfully" });
};
export const deleteBrand = async function (req, res, next) {
  const id = req.params.id;
  const item = await brandSchema.findByIdAndDelete(id);
  res.status(200).send({ msg: "item deleted successfully" });
};
export const updateCategory = async function (req, res, next) {
  const id = req.params.id;
  console.log(req.body);
  const updated = await categorySchema.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  console.log(updated);
  res.status(200).send(updated);
};
export const getSingleCategory = async (req, res, next) => {
  const id = req.params.id;
  const category = await categorySchema.findById(id);
  if (category) {
    res.status(200).send(category);
  }
};
export const getSingleBrand = async (req, res, next) => {
  const id = req.params.id;
  const Brand = await brandSchema.findById(id);
  res.status(200).send(Brand);
};
export const updateBrand = async (req, res, next) => {
  const id = req.params.id;
  const updatedBrand = await brandSchema.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).send(updatedBrand);
};
