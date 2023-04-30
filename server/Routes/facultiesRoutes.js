const express = require("express");
const {
  getFaculty,
  getfaculties,
  addFaculty,
  deleteFaculty,
  updateFaculty,
} = require("../controllers/facultiesController");
const { isLogedin } = require("../middlewares/isLogedin");
const { isAdmin } = require("../middlewares/isAdmin");

const router = express.Router();
router.use(isLogedin);

router.get("/", getfaculties);
router.get("/:faculty_id", getFaculty);
router.post("/", isAdmin, addFaculty);
router.delete("/:faculty_id", isAdmin, deleteFaculty);
router.patch("/:faculty_id", isAdmin, updateFaculty);

module.exports = router;
