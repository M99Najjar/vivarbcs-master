const pool = require("../db");

const Products = {
  find: {
    all: async () => {
      return (
        await pool.query(
          "SELECT product_id, product_name, description,user_name,img FROM products JOIN users USING(user_id) ORDER BY product_id DESC;"
        )
      ).rows;
    },

    byId: async (product_id) => {
      return (
        await pool.query(
          "SELECT product_id, product_name, description,user_name,img FROM products JOIN users USING(user_id) WHERE product_id = $1;",
          [product_id]
        )
      ).rows[0];
    },
  },

  create: async ({ product_name, description, user_id }) => {
    return (
      await pool.query(
        "INSERT INTO products(product_name, description, user_id) values($1,$2,$3) RETURNING *;",
        [product_name, description, user_id]
      )
    ).rows;
  },

  delete: async (product_id) => {
    return (
      await pool.query("DELETE FROM products Where product_id = $1;", [
        product_id,
      ])
    ).rows;
  },

  update: async ({ product_name, description, user_id, product_id }) => {
    return (
      await pool.query(
        "UPDATE products SET product_name = $1, description = $2, user_id = $3 WHERE product_id = $4;",
        [product_name, description, user_id, product_id]
      )
    ).rows;
  },
};

module.exports = { Products };
