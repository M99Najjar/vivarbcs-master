const pool = require("../db");
const { Doctors } = require("../models/Doctor");

/*get single doctor*/
const getDoctor = async (req, res) => {
  const { doctor_id } = req.params;

  try {
    const doctor = await Doctors.find.byId(doctor_id);
    res.status(200).json(doctor.rows[0]);
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*get all doctors*/
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctors.find.all();
    res.json(doctors.rows);
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*get  doctors by subject*/
const getDoctorsBySubject = async (req, res) => {
  const { subject_id } = req.query;
  try {
    const doctors = await Doctors.find.bySubject(subject_id);
    res.status(200).json(doctors.rows);
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*add doctor*/
const addDoctor = async (req, res) => {
  const { doctor_name, subject_id } = req.body;

  try {
    const dbDoctor = await Doctors.create({ doctor_name, subject_id });
    const doctor = dbDoctor.rows;
    res.status(200).json({ doctor, message: "تم إضافة الدكتور بنجاح" });
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*delete doctor*/
const deleteDoctor = async (req, res) => {
  const { doctor_id } = req.params;
  try {
    const doctor = await Doctors.delete(doctor_id);
    res.json({ message: "تم حذف الدكتور بنجاح" });
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*update doctor*/
const updateDoctor = async (req, res) => {
  const { doctor_id } = req.params;
  const { doctor_name, subject_id } = req.body;

  try {
    const doctor = await Doctors.update({ doctor_name, subject_id, doctor_id });
    res.json({ status: "done" });
  } catch (error) {
    handleErrors(req, res, error);
  }
};

module.exports = {
  getDoctorsBySubject,
  getDoctor,
  getDoctors,
  addDoctor,
  deleteDoctor,
  updateDoctor,
};

function handleErrors(req, res, error) {
  let msg;
  switch (error.code) {
    case "23503":
      msg = "لا يمكن حذف الدكتور لوجود محاضرات مرتبطة به";
      break;

    default:
      msg = "حدث خطأ أثناء القيام بالعملية";
      break;
  }
  res.status(400).json({ message: msg });
}
