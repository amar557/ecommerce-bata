import mongoose from "mongoose";

// Subdocument for size + stock (each size variant)
const sizeStockSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { _id: true }
);

// Helper: create URL-friendly slug from title
function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // allow null/empty for existing docs
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      uppercase: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one image URL is required",
      },
    },
    thumbnailImage: {
      type: String,
      trim: true,
    },
    sizes: {
      type: [sizeStockSchema],
      default: [],
      validate: {
        validator: function (v) {
          if (!Array.isArray(v)) return false;
          const sizes = new Set();
          for (const s of v) {
            if (!s.size || typeof s.stock !== "number" || s.stock < 0)
              return false;
            if (sizes.has(String(s.size).trim().toLowerCase())) return false;
            sizes.add(String(s.size).trim().toLowerCase());
          }
          return true;
        },
        message:
          "Sizes must have unique size values and non-negative stock numbers",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    offer: {
      type: Boolean,
      default: false,
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      default: null,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["male", "female", "kids", "unisex"],
        message: "Gender must be one of: male, female, kids, unisex",
      },
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure discount price is less than price when offer is true
itemSchema.pre("validate", function (next) {
  if (this.offer && this.discountPrice != null && this.price != null) {
    if (this.discountPrice >= this.price) {
      next(
        new Error("Discount price must be less than original price when offer is active")
      );
      return;
    }
  }
  next();
});

// Optional: set thumbnail from first image if not provided
itemSchema.pre("save", function (next) {
  if (
    this.thumbnailImage == null ||
    this.thumbnailImage === "" ||
    (typeof this.thumbnailImage === "string" && !this.thumbnailImage.trim())
  ) {
    if (this.images && this.images.length > 0) {
      this.thumbnailImage = this.images[0];
    }
  }
  next();
});

// Generate slug from title if not set
itemSchema.pre("save", function (next) {
  if (!this.slug || (typeof this.slug === "string" && !this.slug.trim())) {
    const base = slugify(this.title) || "product";
    this.slug = `${base}-${(this._id || this.id || Date.now()).toString().slice(-8)}`;
  }
  next();
});

// Virtual: total stock across all sizes
itemSchema.virtual("totalStock").get(function () {
  return (this.sizes || []).reduce((sum, s) => sum + (s.stock || 0), 0);
});

// Indexes for common filters and sorting
itemSchema.index({ gender: 1 });
itemSchema.index({ categoryId: 1 });
itemSchema.index({ brandId: 1 });
itemSchema.index({ offer: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ gender: 1, categoryId: 1 });
itemSchema.index({ price: 1 });
itemSchema.index({ isActive: 1 });
// slug and sku already have unique: true (index created automatically)
// Text index for search on title and description
itemSchema.index({ title: "text", description: "text" });

const ListItem = mongoose.model("Item", itemSchema);
export default ListItem;
