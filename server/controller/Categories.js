import brandSchema from "../Schema/brandSchema.js";
import categorySchema from "../Schema/categorySchema.js";
import accessorySchema from "../Schema/accessorySchema.js";
import ListItem from "../Schema/ItemSchema.js";
import Order from "../Schema/OrderSchema.js";
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
  try {
    const createdItem = new ListItem(req.body); // ✅ use `new` when creating a document
    await createdItem.save();

    res.status(200).json({ msg: "Item listed successfully" });
  } catch (error) {
    console.error("Error listing item:", error);

    res.status(500).json({
      msg: "Failed to list item",
      error: error.message,
    });
  }
};


export const getSuggestedItems = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ✅ 1. Find the current product
    const currentItem = await ListItem.findById(id);
    if (!currentItem) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // ✅ 2. Find similar items (same category or gender, but not the same item)
    const suggestedItems = await ListItem.find({
      _id: { $ne: id }, // exclude current item
      $or: [
        { categoryId: currentItem.categoryId },
        { gender: currentItem.gender },
      ],
    })
      .limit(10) // limit results to 10
      .lean();

    res.status(200).json({
      msg: "Suggested items fetched successfully",
      data: suggestedItems,
    });
  } catch (error) {
    console.error("Error fetching suggested items:", error);
    res.status(500).json({
      msg: "Failed to fetch suggested items",
      error: error.message,
    });
  }
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

export const getAllItems = async (req, res, next) => {
  try {
    const { gender, category, accessory, offer, minPrice, maxPrice } = req.query;
    const filter = { isActive: { $ne: false } };

    if (gender && typeof gender === "string") {
      filter.gender = { $regex: new RegExp(`^${gender.trim()}`, "i") };
    }
    if (category && typeof category === "string") {
      const cat = await categorySchema.findOne({
        category: { $regex: new RegExp(`^${category.trim()}`, "i") },
      });
      if (cat) filter.categoryId = cat._id;
    }
    if (accessory && typeof accessory === "string") {
      const acc = await accessorySchema.findOne({
        accessory: { $regex: new RegExp(`^${accessory.trim()}`, "i") },
      });
      if (acc) filter.accessoryId = acc._id;
    }
    if (offer === "true" || offer === "1") {
      filter.offer = true;
    }
    const priceFilter = {};
    if (minPrice != null && !Number.isNaN(Number(minPrice))) {
      priceFilter.$gte = Number(minPrice);
    }
    if (maxPrice != null && !Number.isNaN(Number(maxPrice))) {
      priceFilter.$lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
      filter.price = priceFilter;
    }

    const items = await ListItem.find(filter)
      .populate("categoryId", "category")
      .populate("brandId", "brand")
      .populate("accessoryId", "accessory");

    if (!items || items.length === 0) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error.message);
    res.status(500).json({ msg: "Failed to fetch items", error: error.message });
  }
};

/** Top N products by quantity sold across orders; falls back to newest products. */
export const getBestSellers = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 5, 20);

    const sales = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.productId": { $ne: null },
        },
      },
      {
        $group: {
          _id: "$items.productId",
          sold: { $sum: { $ifNull: ["$items.quantity", 1] } },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: limit },
    ]);

    let products = [];
    if (sales.length > 0) {
      const ids = sales.map((s) => s._id);
      const soldMap = new Map(sales.map((s) => [String(s._id), s.sold]));
      const found = await ListItem.find({
        _id: { $in: ids },
        isActive: { $ne: false },
      })
        .populate("categoryId", "category")
        .populate("brandId", "brand")
        .populate("accessoryId", "accessory");

      products = ids
        .map((id) => {
          const product = found.find((p) => String(p._id) === String(id));
          if (!product) return null;
          const doc = product.toObject();
          doc.soldCount = soldMap.get(String(id)) || 0;
          return doc;
        })
        .filter(Boolean);
    }

    if (products.length < limit) {
      const excludeIds = products.map((p) => p._id);
      const fillers = await ListItem.find({
        _id: { $nin: excludeIds },
        isActive: { $ne: false },
      })
        .sort({ createdAt: -1 })
        .limit(limit - products.length)
        .populate("categoryId", "category")
        .populate("brandId", "brand")
        .populate("accessoryId", "accessory");

      products = [
        ...products,
        ...fillers.map((p) => {
          const doc = p.toObject();
          doc.soldCount = doc.soldCount || 0;
          return doc;
        }),
      ];
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching best sellers:", error.message);
    res.status(500).json({
      msg: "Failed to fetch best sellers",
      error: error.message,
    });
  }
};

// Search products by title/description (uses text index)
export const searchItems = async (req, res, next) => {
  try {
    const q = req.query.q;
    const filter = { isActive: { $ne: false } };
    if (q && typeof q === "string" && q.trim()) {
      filter.$text = { $search: q.trim() };
    } else {
      return res.status(200).json({ items: [] });
    }
    const items = await ListItem.find(filter, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .populate("categoryId", "category")
      .populate("brandId", "brand")
      .populate("accessoryId", "accessory")
      .limit(50);
    res.status(200).json(items);
  } catch (error) {
    console.error("Error searching items:", error.message);
    res.status(500).json({
      msg: "Failed to search items",
      error: error.message,
    });
  }
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
  const item = await ListItem.findById(id)
    .populate("categoryId", "category")
    .populate("brandId", "brand")
    .populate("accessoryId", "accessory");
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
  const updated = await categorySchema.findByIdAndUpdate(id, req.body, {
    new: true,
  });
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

export const ListAccessories = async function (req, res, next) {
  const created = await accessorySchema(req.body);
  created.save();
  res.status(200).send({ msg: created });
};
export const getAllAccessories = async function (req, res, next) {
  const list = await accessorySchema.find();
  res.status(200).send(list);
};
export const getSingleAccessory = async (req, res, next) => {
  const id = req.params.id;
  const doc = await accessorySchema.findById(id);
  if (doc) res.status(200).send(doc);
  else res.status(404).send({ msg: "Not found" });
};
export const updateAccessory = async function (req, res, next) {
  const id = req.params.id;
  const updated = await accessorySchema.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).send(updated);
};
export const deleteAccessory = async function (req, res, next) {
  const id = req.params.id;
  await accessorySchema.findByIdAndDelete(id);
  res.status(200).send({ msg: "item deleted successfully" });
};
