import ListItem from "../Schema/ItemSchema.js";

export const findCategory = async function (req, res, next) {
  const gender = req.query.gender;

  console.log(gender, category);
  const categories = await ListItem.find({
    gender: { $regex: gender, $options: "i" },
  }).select("category brand");
  res.send(categories);
};
