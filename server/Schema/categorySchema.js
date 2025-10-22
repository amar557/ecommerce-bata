import mongoose from "mongoose";
const catSchema = new mongoose.Schema({
  category: {
    type: String,
    require: true,
  },
});
const categorySchema = mongoose.model("Category", catSchema);
export default categorySchema;
