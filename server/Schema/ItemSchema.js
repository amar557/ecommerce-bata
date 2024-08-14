import mongoose, { mongo } from "mongoose";

const item = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  images: {
    type: Array,
    require: true,
  },
  thumbnailImage: {
    type: String,
  },
  sizes: {
    type: Array,
  },
  category: {
    type: String,
    require: true,
  },
  categoryId: {
    type: String,
  },
  brand: {
    type: String,
    require: true,
  },
  brandId: {
    type: String,
  },
  color: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  offer: {
    type: Boolean,
    default: false,
  },
  discountPrice: {
    type: Number,
  },
  gender: {
    type: String,
    require: true,
  },
});
const ListItem = mongoose.model("item", item);
export default ListItem;
