import ListItem from "../Schema/ItemSchema.js";
import accessorySchema from "../Schema/accessorySchema.js";

/**
 * Navbar: categories & brands = distinct values from active products for this gender.
 * Accessories = full list from the Accessory collection (admin) so the menu updates as soon as
 * types are added, independent of product inventory.
 */
export const findCategory = async function (req, res, next) {
  const gender = req.query.gender;
  if (!gender || typeof gender !== "string") {
    return res.status(400).json({ message: "gender query is required" });
  }

  try {
    const regex = new RegExp(`^${gender.trim()}`, "i");
    const baseFilter = { gender: regex, isActive: { $ne: false } };

    const products = await ListItem.find(baseFilter)
      .populate("categoryId", "category")
      .populate("brandId", "brand")
      .select("categoryId brandId")
      .lean();

    const catMap = new Map();
    const brandMap = new Map();

    for (const p of products) {
      if (p.categoryId?._id) {
        catMap.set(String(p.categoryId._id), {
          _id: p.categoryId._id,
          category: p.categoryId.category,
        });
      }
      if (p.brandId?._id) {
        brandMap.set(String(p.brandId._id), {
          _id: p.brandId._id,
          brand: p.brandId.brand,
        });
      }
    }

    const categories = [...catMap.values()].sort((a, b) =>
      String(a.category || "").localeCompare(String(b.category || ""), undefined, {
        sensitivity: "base",
      })
    );
    const brands = [...brandMap.values()].sort((a, b) =>
      String(a.brand || "").localeCompare(String(b.brand || ""), undefined, {
        sensitivity: "base",
      })
    );

    const accessoryDocs = await accessorySchema.find().sort({ accessory: 1 }).lean();
    const accessories = accessoryDocs.map((a) => ({
      _id: a._id,
      accessory: a.accessory,
    }));

    res.status(200).json({ categories, brands, accessories });
  } catch (err) {
    next(err);
  }
};
