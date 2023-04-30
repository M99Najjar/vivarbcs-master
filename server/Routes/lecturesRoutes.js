const express = require("express");
const router = express.Router();
const { isLogedin } = require("../middlewares/isLogedin");
const { isAdmin } = require("../middlewares/isAdmin");

const {
  getLectures,
  getLecture,
  addLecture,
  deleteLecture,
  updateLecture,
  getPdfLecture,
  getLecturesBy,
} = require("../controllers/LecturesController.js");

router.use(isLogedin);

router.get("/", getLectures);
router.get("/by", getLecturesBy);
router.get("/pdf/:lecture_id", getPdfLecture);
router.get("/:lecture_id", getLecture);
router.post("/", isAdmin, addLecture);
router.delete("/:lecture_id", isAdmin, deleteLecture);
router.patch("/:lecture_id", isAdmin, updateLecture);

module.exports = router;
