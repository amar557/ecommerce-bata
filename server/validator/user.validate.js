import { z } from "zod";
const strongPasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/\d/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character",
  });

export const user = z.object({
  name: z.string().min(1, { message: "name is required" }),
  email: z.string().min(1, { message: "email is required" }),
  password: strongPasswordSchema,
});

export const validateUser = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({ warn: error.issues[0].message });
  }
};
export const logOut = function (req, res, next) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(0),
  });
  res.send({ msg: "logged out successfully" });
};
