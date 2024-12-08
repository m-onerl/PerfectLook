const express = require("express");
const router = express.Router();
const connection = require("../dbConnect");

router.get("/cart", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login"); // Używamy `return`, aby zatrzymać dalsze wykonanie
  }

  console.log(req.session.user.id_user);

  let sql =
    "SELECT p.img_file AS img_file, p.name AS product_name, p.price AS item_price, ROUND((p.price * cart.quantity), 2) AS total_price, cart.quantity AS quantity FROM carts AS cart JOIN users AS c ON cart.id_user = c.id_user JOIN products AS p ON cart.id_product = p.product_id WHERE cart.id_user = ?";
  connection.query(sql, [req.session.user.id_user], (error, result) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send("Error fetching data from the database");
    }

    sql =
      "SELECT ROUND(SUM(carts.quantity * products.price), 2) AS total_price FROM carts JOIN products ON carts.id_product = products.product_id WHERE carts.id_user = ?";
    connection.query(sql, [req.session.user.id_user], (error, sumResult) => {
      if (error) {
        console.error(error.message);
        return res.status(500).send("Error fetching sum from the database");
      }

      const sum = parseFloat(sumResult[0].total_price || 0).toFixed(2);
      console.log(sum);

      // Przekazanie wyników do renderera EJS
      return res.render("cart", { cartItems: result, sum: sum });
    });
  });
});


router.post("/clear-cart", (req, res) => {
  console.log(req.session.user.id_user);

  const Sql = "DELETE FROM carts WHERE id_user = ?";
  connection.query(Sql, [req.session.user.id_user], (error, result) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send("Error deleting items from the cart");
    }
    console.log(
      "All items removed from the cart for user: ",
      req.session.user.id_user
    );
  });
});



// Nowy endpoint do przetwarzania płatności i tworzenia zamówienia
router.post("/process-payment", (req, res) => {
  const userId = req.session.user.id_user;
  const orderDate = new Date().toISOString().slice(0, 19); 
  const { payment_method, address, courier, services } = req.body;
  let status = "oczekiwanie";
  if (payment_method === "creditCard" || payment_method === "blik") {
      status = "zapłacono";
  }
  

  console.log("Processing payment with the following data:");
  console.log("User ID:", userId);
  console.log("Order Date:", orderDate);
  console.log("Address:", address);
  console.log("Courier:", courier);
  console.log("Payment Method:", payment_method);
  console.log("Services:", services);
  console.log("Status:", status);
  console.log("first service:", services[0]);

  const sql = "INSERT INTO orders (id_user, date, address, courier, payment_method, status) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(sql, [userId, orderDate, address, courier, payment_method, status], (error, result) => {
      if (error) {
          console.error("Error creating order:", error.message);
          return res.status(500).send(`Error creating order: ${error.message}`);
      }

      const orderId = result.insertId;
      console.log("Order ID:", orderId);

      const cartItemsSql = "INSERT INTO order_ele (id_order, id_product, quantity) SELECT ?, carts.id_product, carts.quantity FROM carts WHERE carts.id_user = ?";
      connection.query(cartItemsSql, [orderId, userId], (error, result) => {
          if (error) {
              console.error("Error creating order elements:", error.message);
              return res.status(500).send(`Error creating order elements: ${error.message}`);
          }
          let removeProduct = "SELECT * FROM carts WHERE id_user = ?";
          connection.query(removeProduct, [userId], (error, cartResults) => {
            if (error) {
              console.error("Error clearing products:", error.message);
              return res.status(500).send("Error clearing products");
            }
            for(result of cartResults) {
              removeProduct = "UPDATE products SET quantity = quantity - ? WHERE product_id = ?";
              connection.query(removeProduct, [result.quantity, result.id_product], (error, delResult) => {
                if (error) {
                  console.error("Error clearing products:", error.message);
                  return res.status(500).send("Error clearing products");
                }
              });
            }
          const clearCartSql = "DELETE FROM carts WHERE id_user = ?";
          connection.query(clearCartSql, [userId], (error, result) => {
            if (error) {
              console.error("Error clearing cart:", error.message);
              return res.status(500).send("Error clearing cart");
            }
            const servicesQuery = "INSERT INTO order_services (id_order, id_service) SELECT ?, services.id_service FROM services WHERE ? LIKE CONCAT('%', services.name, '%')"
            connection.query(servicesQuery, [orderId, services], (error, result) => {
              if (error) {
                console.error("Error adding services", error.message);
                return res.status(500).send("Error adding services");
              }
            })

            res.send("Płatność zrealizowana pomyślnie. Twoje zamówienie zostało złożone!");
          });
          });
      });
  });
});


module.exports = router;
