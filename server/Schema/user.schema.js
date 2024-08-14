import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const user = mongoose.Schema({
  name: {
    require: true,
    type: String,
  },
  email: {
    require: true,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

user.methods.availToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email, admin: this.admin },
    "secretkeyisgiven",
    { expiresIn: "1h" }
  );

  return token;
};
const userSchema = mongoose.model("user", user);
export default userSchema;
