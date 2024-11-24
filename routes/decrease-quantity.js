const express = require('express');
const router = express.Router();
const connection = require('../dbConnect');

router.post("/decrease-quantity", (req, res) => {
    const productId = req.body.productId; // Poprawne ID produktu
    const sqlUpdate =
      "UPDATE products SET quantity = quantity - 1 WHERE product_id = ? AND quantity > 0";

    connection.query(sqlUpdate, [productId], (error, results) => {
      if (error) {
        console.error(error.message);
        // Poprawiona odpowiedź JSON zamiast send
        res.status(500).json({
          success: false,
          message: "Error updating the product quantity",
        });
      } else if (results.affectedRows === 0) {
        // Poprawiona odpowiedź JSON zamiast send
        res.status(400).json({
          success: false,
          message:
            "Product quantity was not updated, it might be out of stock or does not exist.",
        });
      } else {
        // Poprawiona odpowiedź JSON zamiast send
        res.json({
          success: true,
          message: "Product quantity decreased successfully",
        });
      }
    });
  });

  module.exports = router;