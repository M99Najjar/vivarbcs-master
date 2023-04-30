const sameUser = (req, res, next) => {
  const user = req.user;
  if (req.params.user_id == user.user_id) {
    next();
  } else {
    res.status(400).json({ message: "لا يمكنك تعديل معلومات مستخدم اخر" });
  }
};

module.exports = { sameUser };
