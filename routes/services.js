const express = require('express');
const router = express.Router();
const connection = require('../dbConnect');

router.get("/services", (req, res) => {
    res.render("services");
  });
module.exports = router;