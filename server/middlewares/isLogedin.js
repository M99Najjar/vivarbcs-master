const { Users } = require("../models/User");
const jwt = require("jsonwebtoken");
const JWTSECRET = process.env.JWTSECRET;

const isLogedin = async (req, res, next) => {
  //cheking token
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).json({ message: "2يجب عليك تسجيل الدخول أولا" });
  }
  const token = authorization.split(" ")[1];

  try {
    const { user_id } = jwt.verify(token, JWTSECRET);
    console.log(user_id);
    const user = await Users.find.byId(user_id);
    if (!user.rows[0]) {
      return res.status(403).json({ message: "1يجب عليك تسجيل الدخول أولا" });
    }
    req.user = user.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: "حدث خطأ اثناء القيام بتأكيد المستخدم" });
  }
};

module.exports = { isLogedin };
