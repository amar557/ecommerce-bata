import mongoose from "mongoose";

const accSchema = new mongoose.Schema({
  accessory: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: "",
  },
});

const accessorySchema = mongoose.model("Accessory", accSchema);
export default accessorySchema;
