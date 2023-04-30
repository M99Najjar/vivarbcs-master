const pool = require("../db");

const Users = {
  find: {
    byEmail: async (email) => {
      return await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    },
    byId: async (id) => {
      return await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    },
  },
  create: async ({ name, email, role }) => {
    return pool.query(
      "INSERT INTO USERS(user_name,email,user_role) VALUES($1,$2,$3) RETURNING *",
      [name, email, role]
    );
  },
  update: async ({ user_name, user_year, user_faculty_id, user_id }) => {
    return pool.query(
      "UPDATE users SET user_name = $1, user_year = $2, user_faculty_id = $3 WHERE user_id = $4;",
      [user_name, user_year, user_faculty_id, user_id]
    );
  },
};

module.exports = { Users };
