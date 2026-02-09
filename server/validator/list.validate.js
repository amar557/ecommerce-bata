import { z } from "zod";

export const listSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }).max(200),
    category: z.string().min(1, { message: "Category is required" }),
    brand: z.string().min(1, { message: "Brand is required" }),
    price: z.coerce.number().min(0, { message: "Price must be 0 or greater" }),
    gender: z.enum(["male", "female", "kids", "unisex"], {
      message: "Gender must be one of: male, female, kids, unisex",
    }),
    thumbnailImage: z.string().optional(),
    images: z.array(z.string()).min(1, { message: "At least one image is required" }).optional(),
    description: z.string().optional(),
    color: z.string().min(1, { message: "Color is required" }).optional(),
    offer: z.boolean().optional().default(false),
    discountPrice: z.coerce.number().min(0).optional().nullable(),
    sku: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.offer && data.discountPrice != null && data.price != null) {
        return data.discountPrice < data.price;
      }
      return true;
    },
    { message: "Discount price must be less than original price when offer is active", path: ["discountPrice"] }
  );

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const firstIssue = error?.issues?.[0];
    const message = firstIssue?.message || "Validation failed";
    res.status(400).send({ warn: message });
  }
};
