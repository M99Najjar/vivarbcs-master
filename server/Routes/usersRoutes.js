const express = require("express");
const router = express.Router();

const {
  webLogin,
  androidLogin,
  editUser,
} = require("../controllers/usersControllers");
const { isLogedin } = require("../middlewares/isLogedin");
const { sameUser } = require("../middlewares/sameUser");

router.post("/login", webLogin);
//router.post("/signup", signup);

router.patch("/:user_id", isLogedin, sameUser, editUser);

module.exports = router;
