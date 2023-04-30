const pool = require("../db");
const { Faculties } = require("../models/faculty");

/*get single faculty*/
const getFaculty = async (req, res) => {
  const { faculty_id } = req.params;

  try {
    const faculty = await Faculties.find.byId(faculty_id);
    res.status(200).json(faculty);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

/*get all faculties*/
const getfaculties = async (req, res) => {
  try {
    const faculties = await Faculties.find.all();
    res.json(faculties);
  } catch (error) {
    res.json(error.message);
  }
};

// add faculty
async function addFaculty(req, res) {
  const { faculty_name, university_id } = req.body;
  try {
    const faculties = await Faculties.create({ faculty_name, university_id });
    res.status(200).json(faculties);
  } catch (error) {
    res.json(error.message);
  }
}

// delete faculty
async function deleteFaculty(req, res) {
  const { faculty_id } = req.params;
  try {
    const faculties = await Faculties.delete(faculty_id);
    res.status(200).json({ msg: "done" });
  } catch (error) {
    res.json(error.message);
  }
}

/*update faculty*/
async function updateFaculty(req, res) {
  const { faculty_id } = req.params;
  const { faculty_name, university_id } = req.body;

  try {
    update = await Faculties.update({
      faculty_name,
      university_id,
      faculty_id,
    });
    res.json(update);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

module.exports = {
  getFaculty,
  getfaculties,
  addFaculty,
  deleteFaculty,
  updateFaculty,
};
