const pool = require("../db");

const Subjects = {
  find: {
    all: async () => {
      return await pool.query(
        "SELECT subject_id,subject_name,year,season,faculty_id,faculty_name,university_name FROM subjects JOIN faculties USING(faculty_id) JOIN universities USING(university_id) ORDER BY year ASC;"
      );
    },

    byId: async (subject_id) => {
      return await pool.query(
        "SELECT subject_id,subject_name,year,season,faculty_name,university_name FROM subjects JOIN faculties USING(faculty_id) JOIN universities USING(university_id) WHERE subject_id = $1;",
        [subject_id]
      );
    },

    byUniversity: async (university_id) => {
      return (
        await pool.query(
          "SELECT subject_id,subject_name,year,season,faculty_name,university_name FROM subjects JOIN faculties USING(faculty_id) JOIN universities USING(university_id) WHERE university_id = $1;",
          [university_id]
        )
      ).rows;
    },
    byFacultyAndYear: async ({ faculty_id, year, season }) => {
      return (
        await pool.query(
          "SELECT subject_id,subject_name,year,season,faculty_name,university_name FROM subjects JOIN faculties USING(faculty_id) JOIN universities USING(university_id) WHERE faculty_id = $1 AND year = $2 AND season = $3 ;",
          [faculty_id, year, season]
        )
      ).rows;
    },
  },

  create: async ({ subject_name, year, season, faculty_id }) => {
    return await pool.query(
      "INSERT INTO subjects(subject_name, year , season, faculty_id) values($1,$2,$3,$4) RETURNING *;",
      [subject_name, year, season, faculty_id]
    );
  },

  delete: async (subject_id) => {
    return pool.query("DELETE FROM subjects Where subject_id = $1", [
      subject_id,
    ]);
  },

  update: async ({ subject_name, year, season, faculty_id, subject_id }) => {
    return await pool.query(
      "UPDATE Subjects SET subject_name = $1, year = $2, season = $3, faculty_id = $4 Where subject_id = $5",
      [subject_name, year, season, faculty_id, subject_id]
    ).rows;
  },
};

module.exports = { Subjects };
