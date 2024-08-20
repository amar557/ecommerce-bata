import ListItem from "../Schema/ItemSchema.js";

export const findCategory = async function (req, res, next) {
  const gender = req.query.gender;

  console.log(gender);
  const categories = await ListItem.find({
    gender: { $regex: `^${gender}`, $options: "i" },
  }).select("category brand gender");
  res.status(200).send(categories);
};
