const express = require('express');
const router = express.Router();
const connection = require('../dbConnect');

router.get("/random", (req, res) => {
    const sql = "SELECT * FROM products WHERE product_type='configurable' GROUP BY product_id ORDER BY RAND() LIMIT 3";
    connection.query(sql, (error, results) => {
      if (error) {
        console.error(error.message);
        return res.status(500).send("Error fetching data from the database");
      }
      res.json(results);
    });
  });

  module.exports = router;