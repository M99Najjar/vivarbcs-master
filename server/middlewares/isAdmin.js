const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user.user_role == process.env.ADMIN_ROLE) {
    next();
  } else {
    res.status(400).json({ message: "ليس لديك الصلاحية" });
  }
};

module.exports = { isAdmin };
