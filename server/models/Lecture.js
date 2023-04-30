const pool = require("../db");

const Lectures = {
  find: {
    //
    all: async () => {
      return pool.query(
        "SELECT lecture_id, lecture_name, lecture_type, doctor_id, doctor_name, university_name, faculty_id,faculty_name, subject_id, subject_name, year, season, user_name  FROM lectures JOIN doctors USING(doctor_id) JOIN subjects USING(subject_id) JOIN faculties USING(faculty_id) JOIN universities USING(university_id) JOIN users USING(user_id) ORDER BY lecture_id DESC;"
      );
    },
    //
    byId: async (lecture_id) => {
      return pool.query(
        "SELECT lecture_id, lecture_name, lecture_type, doctor_name, university_name, faculty_name, subject_name, year, season, user_name  FROM lectures JOIN doctors USING(doctor_id) JOIN subjects USING(subject_id) JOIN faculties USING(faculty_id) JOIN universities USING(university_id) JOIN users USING(user_id) WHERE lecture_id = $1;",
        [lecture_id]
      );
    },
    //
    byDoctor: async (doctor_id) => {
      return pool.query(
        "SELECT lecture_id, lecture_name, lecture_type, doctor_name, university_name, faculty_name, subject_name, year, season, user_name  FROM lectures JOIN doctors USING(doctor_id) JOIN subjects USING(subject_id) JOIN faculties USING(faculty_id) JOIN universities USING(university_id) JOIN users USING(user_id) WHERE doctor_id = $1;",
        [doctor_id]
      );
    },
  },

  create: async ({ lecture_name, doctor_id, user_id, lecture_type }) => {
    return pool.query(
      "INSERT INTO lectures(lecture_name, doctor_id, user_id ,lecture_type) values($1,$2,$3,$4) RETURNING *;",
      [lecture_name, doctor_id, user_id, lecture_type]
    );
  },

  delete: async (lecture_id) => {
    return pool.query("DELETE FROM lectures Where lecture_id = $1", [
      lecture_id,
    ]);
  },

  update: async ({
    lecture_name,
    doctor_id,
    user_id,
    lecture_id,
    lecture_type,
  }) => {
    return pool.query(
      "UPDATE lectures SET lecture_name = $1, doctor_id = $2, user_id = $3, lecture_type = $5 Where lecture_id = $4",
      [lecture_name, doctor_id, user_id, lecture_id, lecture_type]
    );
  },
};

module.exports = { Lectures };
