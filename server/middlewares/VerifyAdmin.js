export const verifyAdmin = function (req, res, next) {
  const user = req.user;
  console.log(user);
  if (user.admin) {
    console.log("ijazat mil gaee");
    next();
  } else {
    res.send("invalid creentials");

    // console.log("ijazat nahi");
  }
  //   next();
};
