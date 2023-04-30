const pool = require("../db");

const Faculties = {
  find: {
    //
    all: async () => {
      return (
        await pool.query(
          "SELECT faculty_id,faculty_name,university_name FROM faculties JOIN universities USING (university_id) ORDER BY faculty_id ASC;"
        )
      ).rows;
    },

    //
    byId: async (faculty_id) => {
      return (
        await pool.query(
          "SELECT faculty_id,faculty_name,university_name FROM faculties JOIN universities USING(university_id) WHERE faculty_id = $1;",
          [faculty_id]
        )
      ).rows[0];
    },
  },

  //
  create: async ({ faculty_name, university_id }) => {
    return (
      await pool.query(
        "INSERT INTO faculties(faculty_name,university_id) values($1,$2) RETURNING *;",
        [faculty_name, university_id]
      )
    ).rows;
  },

  //
  delete: async (faculty_id) => {
    return await pool.query("DELETE FROM faculties WHERE faculty_id = $1;", [
      faculty_id,
    ]).rows;
  },

  //
  update: async ({ faculty_name, university_id, faculty_id }) => {
    return await pool.query(
      "UPDATE faculties SET faculty_name = $1, university_id = $2 Where faculty_id = $3 RETURNING *",
      [faculty_name, university_id, faculty_id]
    ).rows;
  },
};

module.exports = { Faculties };
