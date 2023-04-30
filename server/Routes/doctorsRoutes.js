const express = require("express");
const router = express.Router();

const {
  getDoctor,
  getDoctors,
  addDoctor,
  deleteDoctor,
  updateDoctor,
  getDoctorsBySubject,
} = require("../controllers/doctorsController");
const { isLogedin } = require("../middlewares/isLogedin");
const { isAdmin } = require("../middlewares/isAdmin");

router.use(isLogedin);

router.get("/", getDoctors);
router.get("/by", getDoctorsBySubject);
router.get("/:doctor_id", getDoctor);
router.post("/", isAdmin, addDoctor);
router.delete("/:doctor_id", isAdmin, deleteDoctor);
router.patch("/:doctor_id", isAdmin, updateDoctor);

module.exports = router;
