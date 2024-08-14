import userSchema from "../Schema/user.schema.js";
import bcrypt from "bcryptjs";

export const signUpUser = async function (req, res, next) {
  const { name, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await userSchema({ name, email, password: hashedPassword });
  user.save();
  res.send(user);
};

export const signInUser = async function (req, res, next) {
  const { email, password } = req.body;
  const emailExist = await userSchema.findOne({ email });
  //   res.send({ userSchema });
  if (emailExist) {
    const isPassCorrect = bcrypt.compareSync(password, emailExist.password);
    if (isPassCorrect) {
      const token = emailExist.availToken();

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });

      res.send({
        msg: "logged in successfull",
        token,
        admin: emailExist.admin,
        user: emailExist.name,
      });
    } else {
      res.send({ msg: "password is incorrect" });
    }
  } else {
    res.send({ msg: "email not found" });
  }
};
export const userdata = (req, res, next) => {
  console.log(req.user);
  res.send({ user: req.user });
};
