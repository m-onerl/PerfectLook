const express = require('express');
const router = express.Router();
const connection = require('../dbConnect');

router.get("/payment_stage2", (req, res) => {
    res.render("payment_stage2");
});
  // Trasa dla płatności
router.get("/payment_stage1", (req, res) => {
    var errorFound = 0;
    let sql = "SELECT * FROM carts WHERE id_user = ?";
    connection.query(sql, [req.session.user.id_user], (error, results) => {
      if (error) {
        console.error(error.message);
        return res.status(500).send("Error fetching data from the database");
      }
      let innersql = "SELECT qauntity FROM products WHERE product_id = ?";
      for(let result of results) {
        connection.query(innersql, [result.id_product], (error, innerResults) => {
          if (error) {
            console.error(error.message);
            return res.status(500).send("Error fetching data from the database");
          }
          if(result.quantity > innerResults[0].qauntity) {
            errorFound = 1;
            connection.query("UPDATE carts SET quantity = ? WHERE id_user = ? AND id_product = ?", [innerResults[0].qauntity, req.session.user.id_user, result.id_product], (error, cartUpdate) => {
              if (error) {
                console.error(error.message);
                return res.status(500).send("Error fetching data from the database");
              }
            });
          }
        });
      }
      if(errorFound == 1) {
        res.redirect("/cart");
      }
    });
    console.log(req.session.user.id_user);
    // Fetch courier data
    const sql1 = "SELECT name, price FROM couriers";
    connection.query(sql1, (error, couriers) => {
      if (error) {
        console.error(error.message);
        return res.status(500).send("Error fetching data from the database");
      }

      // Fetch user address
      const sql2 = "SELECT address FROM users WHERE id_user = ?";
      connection.query(sql2, [req.session.user.id_user], (error, address) => {
        if (error) {
          console.error(error.message);
          return res.status(500).send("Error fetching data from the database");
        }

        // Fetch services data
        const sql3 = "SELECT name, discription, basic_price FROM services";
        connection.query(sql3, (error, services) => {
          if (error) {
            console.error(error.message);
            return res
              .status(500)
              .send("Error fetching data from the database");
          }

          // Fetch total sum from cart
          const sql4 =
            "SELECT SUM(carts.quantity*products.price) AS total_price FROM carts JOIN products ON carts.id_product = products.product_id WHERE carts.id_user = ?";
          connection.query(
            sql4,
            [req.session.user.id_user],
            (error, sumResult) => {
              if (error) {
                console.error(error.message);
                return res
                  .status(500)
                  .send("Error fetching sum from the database");
              }
              var sum = sumResult[0].total_price;

              // Render the payment_stage view with the fetched data
                res.render("payment_stage1", {
                  couriers: couriers,
                  address: address,
                  services: services,
                  sum: sum,
                });
            }
          );
        });
      });
    });
});

module.exports = router;