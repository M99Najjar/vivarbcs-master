const pool = require("../db");
const { Lectures } = require("../models/Lecture");
const fs = require("fs");
const path = require("path");

/*get single lectures*/
const getLecture = async (req, res) => {
  const { lecture_id } = req.params;
  try {
    const lecture = await Lectures.find.byId(lecture_id);
    res.status(200).json(lecture.rows[0]);
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*get all lectures*/
const getLectures = async (req, res) => {
  try {
    const lectures = await Lectures.find.all();
    res.json(lectures.rows);
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*add lecture*/
const addLecture = async (req, res) => {
  const { lecture_name, doctor_id, lecture_type } = req.body;
  const user = req.user;
  user_id = user.user_id;
  if (!req.files) return res.status(400).json({ message: "لم يتم رفع أي ملف" });
  const file = req.files.file;
  const fileFormat = file.name.split(".").slice(-1)[0];
  if (fileFormat != "pdf")
    return res.status(400).json({ message: "الرجاء اختيار ملفات pdf فقط" });

  try {
    const lecture = await Lectures.create({
      lecture_name,
      doctor_id,
      user_id,
      lecture_type,
    });
    file.mv(`${__dirname}/../uploads/${lecture_name}.pdf`, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        res.json({ message: `تم رفع ${lecture_name} بنجاح` });
      }
    });
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*delete lecture*/
const deleteLecture = async (req, res) => {
  const { lecture_id } = req.params;
  async function getOldLecture() {
    try {
      const lectureQuery = await Lectures.find.byId(lecture_id);
      return lectureQuery.rows[0];
    } catch (error) {
      console.log(error);
    }
  }

  try {
    const oldLecture = await getOldLecture();
    const oldLecturePath = `${__dirname}/../uploads/${oldLecture.lecture_name}.pdf`;
    fs.unlink(oldLecturePath, (err) => {
      console.log(err);
    });
    await Lectures.delete(lecture_id);
    res.json({ message: "تم حذف المحاضرة بنجاح" });
  } catch (error) {
    handleErrors(req, res, error);
  }
};

/*update lecture*/
const updateLecture = async (req, res) => {
  const user = req.user;
  const user_id = user.user_id;
  const { lecture_id } = req.params;
  const { lecture_name, doctor_id, lecture_type } = req.body;

  async function getOldLecture() {
    try {
      const oldLecture = await Lectures.find.byId(lecture_id);
      return oldLecture.rows[0];
    } catch (error) {}
  }

  if (!req.files) {
    const oldLecture = await getOldLecture();
    try {
      if (lecture_name !== oldLecture.lecture_name) {
        const oldLecturePath = `${__dirname}/../uploads/${oldLecture.lecture_name}.pdf`;
        const newLecturePath = `${__dirname}/../uploads/${lecture_name}.pdf`;
        fs.rename(oldLecturePath, newLecturePath, function (err) {
          if (err) console.log("ERROR: " + err);
        });
      }
      await Lectures.update({
        lecture_name,
        doctor_id,
        user_id,
        lecture_id,
        lecture_type,
      });
      res.json({ message: "تم حفظ التعديلات" });
    } catch (error) {
      handleErrors(req, res, error);
    }
  }

  if (req.files) {
    const oldLecture = await getOldLecture();
    const file = req.files.file;
    const fileFormat = file.name.split(".").slice(-1)[0];
    if (fileFormat != "pdf") {
      return res.status(400).json({ msg: "pdf only" });
    } else {
      try {
        const lecture = await Lectures.update({
          lecture_name,
          doctor_id,
          user_id,
          lecture_id,
          lecture_type,
        });
        const oldLecturePath = `${__dirname}/../uploads/${oldLecture.lecture_name}.pdf`;
        fs.unlink(oldLecturePath, (err) => {
          console.log(err);
        });
        file.mv(`${__dirname}/../uploads/${lecture_name}.pdf`, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          } else {
            res.json({ message: `تم رفع ${lecture_name} بنجاح` });
          }
        });
      } catch (error) {
        console.log(error.message);
        handleErrors(req, res, error);
      }
    }
  }
};

const getPdfLecture = async (req, res) => {
  const { lecture_id } = req.params;
  try {
    const query = await pool.query(
      `SELECT * FROM LECTURES WHERE lecture_id = $1`,
      [lecture_id]
    );
    const lecture = query.rows[0];
    console.log(lecture);

    let indexPath = path.join(
      __dirname,
      `../uploads/${lecture.lecture_name}.pdf`
    );
    console.log(indexPath);

    res.sendFile(indexPath);
  } catch (error) {
    handleErrors(req, res, error);
  }
};

const getLecturesBy = async (req, res) => {
  const { doctor_id } = req.query;
  try {
    const query = await pool.query(
      "SELECT * FROM lectures WHERE doctor_id=$1;",
      [doctor_id]
    );
    const lecture = query.rows;
    res.status(200).json(lecture);
  } catch (error) {
    handleErrors(req, res, error);
  }
};

module.exports = {
  getLecture,
  getLectures,
  addLecture,
  deleteLecture,
  updateLecture,
  getPdfLecture,
  getLecturesBy,
};

function handleErrors(req, res, error) {
  console.log(error);
  let msg;
  switch (error.code) {
    case "23505":
      msg = "لا يمكن اضافة اكثر من محاضرة تحمل نفس الاسم";
      break;
    case "23502":
      msg = "يجب عليك ملئ جميع الخانات";

    default:
      msg = "حدث خطأ أثناء القيام بالعملية";
      break;
  }
  res.status(400).json({ message: msg });
}
