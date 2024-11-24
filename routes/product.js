const express = require('express');
const router = express.Router();
const connection = require('../dbConnect');
const { createSlots } = require('vue');

router.get("/product/:id", (req, res) => {
    const productId = req.params.id;
    var cartQuantity;
    var difQuantity;

    // Zapytanie dla produktu typu configurable
    const sqlForConfigurable = `
    SELECT s.*
    FROM products c
    JOIN simple_to_configurable stc ON c.product_id = stc.configurable_id
    JOIN products s ON stc.simple_id = s.product_id
    WHERE c.product_type = 'configurable' AND c.product_id = ?;
  `;

    // Zapytanie dla produktu typu simple powiązanego z configurable
    const sqlForSimple = `
    SELECT s.*
    FROM simple_to_configurable stc1
    JOIN products p ON stc1.simple_id = p.product_id
    JOIN simple_to_configurable stc2 ON stc1.configurable_id = stc2.configurable_id
    JOIN products s ON stc2.simple_id = s.product_id
    WHERE stc1.simple_id = ?;
  `;
    const sqlForQuantity = `
    SELECT quantity
    FROM carts
    WHERE id_product = ? AND id_user = ?;
    `;

    // Najpierw sprawdzamy, czy podane ID produktu jest typu configurable
    connection.query(
      sqlForConfigurable,
      [productId],
      (error, configResults) => {
        if (error) {
          console.error(error.message);
          return res.status(500).send("Error fetching data from the database");
        }

        if (configResults.length > 0) {
          // Jeśli jest to produkt configurable, pobierz dane i przekieruj do jednego z jego produktów simple
          let productData = configResults[0];
          if(req.session.user) {
            connection.query(
              sqlForQuantity,
              [productId, req.session.user.id_user],
              (error, result) => {
                if (error) {
                  console.error(error.message);
                  return res.status(500).send("Error fetching data from the database");
                }
                  if(result.length > 0) {
                  cartQuantity = result[0].quantity;
                  console.log("quantity: "+ cartQuantity);
                  console.log("Cart Quantity simple: "+ cartQuantity);
                  difQuantity = productData.qauntity - cartQuantity;
                  console.log("Dif Quantity simple: "+difQuantity);
                  res.render("product", {
                    product: productData,
                    otherVariants: configResults,
                    difQuantity : difQuantity
                  });
                }
                else {
                  cartQuantity = 0;
                  console.log("Cart Quantity simple: "+ cartQuantity);
                  difQuantity = productData.qauntity - cartQuantity;
                  console.log("Dif Quantity simple: "+difQuantity);
                  res.render("product", {
                    product: productData,
                    otherVariants: configResults,
                    difQuantity : difQuantity
                  });
                }
  
              }
            );
          }
          else {
            cartQuantity = 0;
            console.log("Cart Quantity simple: "+ cartQuantity);
            difQuantity = productData.qauntity - cartQuantity;
            console.log("Dif Quantity simple: "+difQuantity);
            res.render("product", {
              product: productData,
              otherVariants: configResults,
              difQuantity : difQuantity
            });
          } 
        } else {
          // Jeśli nie jest to produkt configurable, sprawdzamy, czy jest to produkt simple
          connection.query(
            sqlForSimple,
            [productId],
            (error, simpleResults) => {
              if (error) {
                console.error(error.message);
                return res
                  .status(500)
                  .send("Error fetching data from the database");
              }

              if (simpleResults.length > 0) {
                // Znajdź produkt simple, którego ID szukaliśmy
                const productData = simpleResults.find(
                  (p) => p.product_id == productId
                );
                if (productData) {
                  if(req.session.user) {
                  connection.query(
                    sqlForQuantity,
                    [productId, req.session.user.id_user],
                    (error, result) => {
                      if (error) {
                        console.error(error.message);
                        return res.status(500).send("Error fetching data from the database");
                      }
                        if(result.length > 0) {
                        cartQuantity = result[0].quantity;
                        console.log("quantity: "+ cartQuantity);
                        console.log("Cart Quantity simple: "+ cartQuantity);
                        difQuantity = productData.qauntity - cartQuantity;
                        console.log("Dif Quantity simple: "+difQuantity);
                        res.render("product", {
                          product: productData,
                          otherVariants: simpleResults,
                          difQuantity : difQuantity
                        });
                      }
                      else {
                        cartQuantity = 0;
                        console.log("Cart Quantity simple: "+ cartQuantity);
                        difQuantity = productData.qauntity - cartQuantity;
                        console.log("Dif Quantity simple: "+difQuantity);
                        res.render("product", {
                          product: productData,
                          otherVariants: simpleResults,
                          difQuantity : difQuantity
                        });
                      }
        
                    }
                  );
                }
                else {
                  cartQuantity = 0;
                  console.log("Cart Quantity simple: "+ cartQuantity);
                  difQuantity = productData.qauntity - cartQuantity;
                  console.log("Dif Quantity simple: "+difQuantity);
                  res.render("product", {
                    product: productData,
                    otherVariants: simpleResults,
                    difQuantity : difQuantity
                  });
                }
                } else {
                  return res.status(404).send("Product not found");
                }
              } else {
                return res.status(404).send("Product not found");
              }
            }
          );
        }
      }
    );
});
router.post("/product/:id", (req, res) => {
if (!req.session.user) res.redirect("/login");
else {
    const product_id = req.params.id;
    const quantity = req.body.addtocart;
    console.log(quantity);
    const sql =
    "UPDATE products SET qauntity = qauntity - ? WHERE product_id = ? AND qauntity > 0";
    /*connection.query(sql, [quantity, product_id], (error, results) => {
    if (error) {
        console.error(error.message);
        return res.status(500).send("Error fetching data from the database");
    }*/
    var innersql =
        "UPDATE products SET qauntity = qauntity - ? WHERE product_type = 'configurable' AND qauntity > 0 AND category_id = (SELECT category_id FROM products WHERE product_id = ?)";
    /*connection.query(innersql, [quantity, product_id], (error, results) => {
        if (error) {
        console.error(error.message);
        return res
            .status(500)
            .send("Error fetching data from the database");
        }*/
        innersql = "SELECT * FROM carts WHERE id_user = ? AND id_product = ?";
        connection.query(
        innersql,
        [req.session.user.id_user, product_id],
        (error, results) => {
            if (error) {
            console.error(error.message);
            return res
                .status(500)
                .send("Error fetching data from the database");
            }
            if (results.length === 0) {
            innersql =
                "INSERT INTO carts (id_user, id_product, quantity) VALUES (?, ?, ?);";
            connection.query(
                innersql,
                [req.session.user.id_user, product_id, quantity],
                (error, results) => {
                if (error) {
                    console.error(error.message);
                    return res
                    .status(500)
                    .send("Error fetching data from the database");
                }
                }
            );
            } else {
            innersql =
                "UPDATE carts SET quantity = quantity + ? WHERE id_user = ? AND id_product = ?";
            connection.query(
                innersql,
                [quantity, req.session.user.id_user, product_id],
                (error, results) => {
                if (error) {
                    console.error(error.message);
                    return res
                    .status(500)
                    .send("Error fetching data from the database");
                }
                }
            );
            }
        }
        );
    res.redirect(`/product/${product_id}`);
}
});

module.exports = router;