import mongoose from "mongoose";
const brands = new mongoose.Schema({
  brand: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    default: "",
  },
});
const brandSchema = mongoose.model("Brand", brands);
export default brandSchema;
