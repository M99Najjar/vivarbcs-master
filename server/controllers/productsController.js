const pool = require("../db");
const { Products } = require("../models/Product");
const path = require("path");
const fs = require("fs");

/*get single product*/
const getProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    const product = await Products.find.byId(product_id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

/*get all products*/
const getProducts = async (req, res) => {
  try {
    const products = await Products.find.all();
    res.status(200).json(products);
  } catch (error) {
    res.json(error.message);
  }
};

/*add product*/
const addProduct = async (req, res) => {
  const { product_name, description } = req.body;
  const user_id = 1;
  if (!req.files) return res.status(400).json({ message: "لم يتم رفع أي ملف" });
  const file = req.files.file;
  const fileFormat = file.name.split(".").slice(-1)[0];
  if (fileFormat != "png")
    return res.status(400).json({ message: "الرجاء اختيار ملفات png فقط" });

  try {
    console.log("creating");
    const products = await Products.create({
      product_name,
      description,
      user_id,
    });
    console.log("done creating");

    const product_id = products[0].product_id;

    console.log("moving");
    file.mv(`${__dirname}/../product_icons/${product_id}.png`, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        res.status(200).json({ message: "نم إضافة المنتج بنجاح" });
      }
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

/*delete product*/
const deleteProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    const oldProductPath = `${__dirname}/../product_icons/${product_id}.png`;

    fs.unlink(oldProductPath, (err) => {
      console.log(err);
    });
    await Products.delete(product_id);
    res.json({ status: "done" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

/*update product*/
const updateProduct = async (req, res) => {
  const { product_id } = req.params;
  const { product_name, description } = req.body;
  const user_id = 1;

  try {
    if (req.files) {
      const file = req.files.file;
      const fileFormat = file.name.split(".").slice(-1)[0];
      if (fileFormat != "png")
        return res.status(400).json({ message: "الرجاء اختيار ملفات png فقط" });
      const oldProductPath = `${__dirname}/../product_icons/${product_id}.png`;

      fs.unlink(oldProductPath, (err) => {
        console.log(err);
      });
      file.mv(`${__dirname}/../product_icons/${product_id}.png`, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
      });
    }

    await Products.update({ product_name, description, user_id, product_id });
    res.json({ status: "done" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getProductIcon = async (req, res) => {
  const { product_id } = req.params;

  try {
    console.log(product_id);
    let indexPath = path.join(__dirname, `../product_icons/${product_id}.png`);
    res.sendFile(indexPath);
  } catch (error) {
    console.log(error);
    handleErrors(req, res, error);
  }
};

module.exports = {
  getProduct,
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  getProductIcon,
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
