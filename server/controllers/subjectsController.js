const pool = require("../db");
const { Subjects } = require("../models/Subject");
const fs = require("fs");
const path = require("path");

/*get single subject*/
const getSubject = async (req, res) => {
  const { subject_id } = req.params;

  try {
    const Subject = await Subjects.find.byId(subject_id);
    res.status(200).json(Subject.rows[0]);
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*get all subjects*/
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subjects.find.all();
    res.json(subjects.rows);
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*add subject*/
const addSubject = async (req, res) => {
  console.log("starting");
  const { subject_name, year, season, faculty_id } = req.body;

  if (!req.files) return res.status(400).json({ message: "لم يتم رفع أي ملف" });
  const file = req.files.file;
  const fileFormat = file.name.split(".").slice(-1)[0];
  if (fileFormat != "png")
    return res.status(400).json({ message: "الرجاء اختيار ملفات png فقط" });

  try {
    const subjects = await Subjects.create({
      subject_name,
      year,
      season,
      faculty_id,
    });
    const subject_id = subjects.rows[0].subject_id;
    file.mv(`${__dirname}/../subjects_icons/${subject_id}.png`, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        res.status(200).json({ message: "نم إضافة المادة بنجاح" });
      }
    });
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*delete subject*/
const deleteSubject = async (req, res) => {
  const { subject_id } = req.params;

  try {
    const oldSubjectPath = `${__dirname}/../subjects_icons/${subject_id}.png`;

    fs.unlink(oldSubjectPath, (err) => {
      console.log(err);
    });
    const subject = await Subjects.delete(subject_id);

    res.json({ message: "تم حذف المادة بنجاح" });
  } catch (error) {
    console.log(error);
    handleErrors(req, res, error);
  }
};

/*update subject*/
const updateSubject = async (req, res) => {
  const { subject_id } = req.params;
  const { subject_name, year, season, faculty_id } = req.body;

  try {
    if (req.files) {
      const file = req.files.file;
      const fileFormat = file.name.split(".").slice(-1)[0];
      if (fileFormat != "png")
        return res.status(400).json({ message: "الرجاء اختيار ملفات png فقط" });
      const oldSubjectPath = `${__dirname}/../subjects_icons/${subject_id}.png`;

      fs.unlink(oldSubjectPath, (err) => {
        console.log(err);
      });
      file.mv(`${__dirname}/../subjects_icons/${subject_id}.png`, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
      });
    }
    const subject = await Subjects.update({
      subject_name,
      year,
      season,
      faculty_id,
      subject_id,
    });
    res.json({ message: "تم تعديل المادة بنجاح" });
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*----- get subject by faculty and year ------*/
const getSubjectBy = async (req, res) => {
  const { faculty_id, year, season } = req.query;

  try {
    const Subject = await Subjects.find.byFacultyAndYear({
      faculty_id,
      year,
      season,
    });
    res.status(200).json(Subject);
  } catch (error) {
    handleErrors(req, res, error);
  }
};
const getSubjectIcon = async (req, res) => {
  const { subject_id } = req.params;

  try {
    let indexPath = path.join(__dirname, `../subjects_icons/${subject_id}.png`);
    res.sendFile(indexPath);
  } catch (error) {
    handleErrors(req, res, error);
  }
};

module.exports = {
  getSubject,
  getSubjects,
  addSubject,
  deleteSubject,
  updateSubject,
  getSubjectBy,
  getSubjectIcon,
};

function handleErrors(req, res, error) {
  let msg;
  switch (error.code) {
    case "23503":
      msg = "لا يمكن حذف المادة لوجود دكاترة مرتبطة بها";
      break;

    default:
      msg = "حدث خطأ أثناء القيام بالعملية";
      break;
  }
  res.status(400).json({ message: msg });
}
