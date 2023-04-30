const pool = require("../db");

const Doctors = {
  find: {
    all: async () => {
      return pool.query(
        "SELECT doctor_id, doctor_name, university_name,faculty_id, faculty_name, subject_id, subject_name, year, season  FROM doctors JOIN subjects USING(subject_id) JOIN faculties USING(faculty_id) JOIN universities USING(university_id) ORDER BY year ASC;"
      );
    },

    byId: async (doctor_id) => {
      return pool.query(
        "SELECT doctor_id, doctor_name, university_name, faculty_name, subject_id, subject_name, year, season  FROM doctors JOIN subjects USING(subject_id) JOIN faculties USING(faculty_id) JOIN universities USING(university_id) WHERE doctor_id = $1;",
        [doctor_id]
      );
    },

    bySubject: async (subject_id) => {
      return pool.query(
        "SELECT doctor_id, doctor_name, university_name, faculty_name, subject_id, subject_name, year, season  FROM doctors JOIN subjects USING(subject_id) JOIN faculties USING(faculty_id) JOIN universities USING(university_id) WHERE subject_id = $1;",
        [subject_id]
      );
    },
  },

  create: async ({ doctor_name, subject_id }) => {
    return pool.query(
      "INSERT INTO doctors(doctor_name,subject_id) values($1,$2) RETURNING *;",
      [doctor_name, subject_id]
    );
  },

  delete: async (doctor_id) => {
    return pool
      .query("DELETE FROM doctors Where doctor_id = $1", [doctor_id])
      .catch((err) => {
        throw err;
      });
  },

  update: async ({ doctor_name, subject_id, doctor_id }) => {
    return pool.query(
      "UPDATE Doctors SET doctor_name = $1,subject_id = $2 Where doctor_id = $3",
      [doctor_name, subject_id, doctor_id]
    );
  },
};

module.exports = { Doctors };
