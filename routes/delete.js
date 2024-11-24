const express = require('express');
const router = express.Router();
const connection = require('../dbConnect');

router.get("/delete/:product_name/:delquantity", (req, res) => {
    const product_name = req.params.product_name;
    const delquantity = req.params.delquantity;
    var quantity, product_id;
    const sql1 =
      "SELECT carts.quantity, carts.id_product FROM carts JOIN products ON carts.id_product = products.product_id WHERE products.name = ? AND carts.id_user = ?";
    connection.query(
      sql1,
      [product_name, req.session.user.id_user],
      (error, result) => {
        if (error) {
          console.error(error.message);
          return res.status(500).send("Error fetching data from the database");
        }
        quantity = result[0].quantity;
        product_id = result[0].id_product;
        console.log(quantity, product_id);
        if (quantity == delquantity) {
          const sql3 =
            "DELETE FROM carts WHERE id_user = ? AND id_product  = ?";
          connection.query(
            sql3,
            [req.session.user.id_user, product_id],
            (error, results) => {
              if (error) {
                console.error(error.message);
                return res
                  .status(500)
                  .send("Error fetching data from the database");
              }
              console.log("Udalo sie usunac z koszyka");
              console.log(quantity, product_id);
            }
          );
        } else {
          const sql3 =
            "UPDATE carts SET quantity = quantity - ? WHERE id_user = ? AND id_product = ?";
          connection.query(
            sql3,
            [delquantity, req.session.user.id_user, product_id],
            (error, results) => {
              if (error) {
                console.error(error.message);
                return res
                  .status(500)
                  .send("Error fetching data from the database");
              }
              console.log("Udalo sie usunac z koszyka");
              console.log(quantity, product_id);
            }
          );
        }
        /*const sql2 =
          "UPDATE products SET qauntity = qauntity + ? WHERE product_id = ? OR (product_type = 'configurable' AND category_id = (SELECT category_id FROM products WHERE product_id = ?))";
        connection.query(
          sql2,
          [quantity, product_id, product_id],
          (error, result) => {
            if (error) {
              console.error(error.message);
              return res
                .status(500)
                .send("Error fetching data from the database");
            }
            console.log("Udalo sie zwrocic do magazynu");
            console.log(quantity, product_id);
            
          }
        );*/
      }
    );
    res.redirect("/cart");
  });

  module.exports = router;