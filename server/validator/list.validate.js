import { z } from "zod";
export const listSchema = z.object({
  title: z.string().min(1, { message: "title is required" }),
  category: z.string().min(1, { message: "category is required" }),
  brand: z.string().min(1, { message: "brand is required" }),
  price: z.number().min(1, { message: "price is required" }),
  gender: z.string().min(1, { message: "gender should be selected" }),
  thumbnailImage: z.string().min(1, { message: "thumbnail image is required" }),
});

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({ warn: error.issues[0].message });
  }
};
