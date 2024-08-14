import mongoose from "mongoose";
const brands = new mongoose.Schema({
  brand: {
    type: String,
    require: true,
  },
});
const brandSchema = mongoose.model("brands", brands);
export default brandSchema;
