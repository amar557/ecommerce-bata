import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      required: true,
    },
    thumbnailImage: {
      type: String,
    },
    sizes: [
      {
        size: {
          type: String,
          required: true,
          trim: true,
        },
        stock: {
          type: Number,
          required: true,
          trim: true,
        },
      },
    ],

    category: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: String,
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    color: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
      required: true,
    },
  },
  { timestamps: true }
);

const ListItem = mongoose.model("Item", itemSchema);
export default ListItem;
