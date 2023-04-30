const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/isAdmin");

const {
  getProduct,
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  getProductIcon,
} = require("../controllers/productsController");
const { isLogedin } = require("../middlewares/isLogedin");

router.use(isLogedin);
router.get("/", getProducts);
router.get("/icon/:product_id", getProductIcon);
router.get("/:product_id", getProduct);
router.post("/", isAdmin, addProduct);
router.delete("/:product_id", isAdmin, deleteProduct);
router.patch("/:product_id", isAdmin, updateProduct);

module.exports = router;
