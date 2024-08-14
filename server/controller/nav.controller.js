import ListItem from "../Schema/ItemSchema.js";

export const findCategory = async function (req, res, next) {
  const gender = req.query.gender;
  const category = req.query.category;
  console.log(gender, category);
  const categories = await ListItem.find({
    category: { $regex: category, $options: "i" },
  }).select("category brand");
  res.send(categories);
};
