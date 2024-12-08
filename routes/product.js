const express = require('express');
const router = express.Router();
const connection = require('../dbConnect');

// GET route to fetch product details
router.get("/product/:id", (req, res) => {
    const productId = req.params.id;

    // SQL query to fetch all products ordered by product_id
    const sql = `
        SELECT * 
        FROM products 
        ORDER BY product_id ASC;
    `;

    connection.query(sql, (error, results) => {
        if (error) {
            console.error("Database error:", error.message);
            return res.status(500).json({ error: "Error fetching product details" });
        }

        const productData = results.find(product => product.product_id == productId);

        if (!productData) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Fetch related product variants
        const otherVariants = productData.configurable_id
            ? results.filter(product => 
                product.configurable_id === productData.configurable_id && 
                product.product_id !== productId
              )
            : [];

        const difQuantity = productData.quantity - (
            req.session?.user?.cart?.[productId]?.quantity || 0
        );

        // Sprawdź, czy zapytanie jest typu JSON (z fetch)
        if (req.headers.accept.includes("application/json")) {
            return res.json({
                product: productData,
                otherVariants,
                difQuantity
            });
        }

        // Renderowanie strony
        res.render("product", {
            product: productData,
            otherVariants,
            difQuantity
        });
    });
});

// POST route to add a product to the cart
router.post("/product/:id", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    const productId = req.params.id;
    const quantity = parseInt(req.body.addtocart, 10);

    if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).send("Invalid quantity");
    }

    // SQL to update product quantity
    const updateProductSql = `
        UPDATE products 
        SET quantity = quantity - ? 
        WHERE product_id = ? AND quantity >= ?;
    `;

    connection.query(updateProductSql, [quantity, productId, quantity], (error, results) => {
        if (error) {
            console.error("Error updating product quantity:", error.message);
            return res.status(500).send("Error updating product quantity");
        }

        if (results.affectedRows === 0) {
            return res.status(400).send("Not enough stock available");
        }

        // SQL to check if the product is already in the user's cart
        const checkCartSql = `
            SELECT * FROM carts 
            WHERE id_user = ? AND id_product = ?;
        `;

        connection.query(checkCartSql, [req.session.user.id_user, productId], (error, cartResults) => {
            if (error) {
                console.error("Error fetching cart data:", error.message);
                return res.status(500).send("Error fetching cart data");
            }

            if (cartResults.length > 0) {
                // Update existing cart entry
                const updateCartSql = `
                    UPDATE carts 
                    SET quantity = quantity + ? 
                    WHERE id_user = ? AND id_product = ?;
                `;

                connection.query(updateCartSql, [quantity, req.session.user.id_user, productId], (error) => {
                    if (error) {
                        console.error("Error updating cart:", error.message);
                        return res.status(500).send("Error updating cart");
                    }
                    res.redirect(`/product/${productId}`);
                });
            } else {
                // Insert new entry into cart
                const insertCartSql = `
                    INSERT INTO carts (id_user, id_product, quantity) 
                    VALUES (?, ?, ?);
                `;

                connection.query(insertCartSql, [req.session.user.id_user, productId, quantity], (error) => {
                    if (error) {
                        console.error("Error inserting into cart:", error.message);
                        return res.status(500).send("Error inserting into cart");
                    }
                    res.redirect(`/product/${productId}`);
                });
            }
        });
    });
});

module.exports = router;
