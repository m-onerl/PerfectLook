const express = require("express");
const router = express.Router();
const connection = require("../dbConnect");

router.get("/store", (req, res) => {
  const sql = "SELECT * FROM products WHERE product_type='configurable'";
  connection.query(sql, (error, results) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send("Error fetching data from the database");
    }
    res.render("store", { products: results });
  });
});
module.exports = router;

