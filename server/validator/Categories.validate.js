import { z } from "zod";
export const listCategory = z.object({
  category: z.string().min(1, { message: "category should not be empty" }),
});
export const listbrand = z.object({
  brand: z.string().min(1, { message: "brand should not be empty" }),
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
