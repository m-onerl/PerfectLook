const express = require("express");
const router = express.Router();
const connection = require("../dbConnect");

router.get("/get_materials", (req, res) => {
  const sql = "SELECT * FROM materials";
  connection.query(sql, (error, results) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send("Error fetching data from the database");
    }
    res.json(results);
  });
});

module.exports = router;
