import express from "express";
import {
  deleteItem,
  getAllItems,
  getItem,
  listItem,
  updateItem,
} from "../controller/Categories.js";
import { listSchema, validate } from "../validator/list.validate.js";
const route = express.Router();

route.post("/listItem", validate(listSchema), listItem);
route.put("/updateItem/:id", updateItem);
route.delete("/deleteItem/:id", deleteItem);
route.get("/items", getAllItems);
route.get("/finditem/:id", getItem);
export default route;
