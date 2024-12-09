const express = require('express');
const router = express.Router();
const connection = require('../dbConnect');
const multer = require('multer');
const upload = multer({ dest: 'public/img/' });

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.permission === 'admin') {
    next();
  } else {
    res.status(403).send('Access denied');
  }
}

// Render admin options page
router.get('/admin-options', isAdmin, (req, res) => {
  res.render('admin-options', { data: [], currentView: '' });
});

// Show couriers
router.get('/admin-options/couriers', isAdmin, (req, res) => {
  const query = 'SELECT * FROM couriers';
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send('Error fetching couriers');
    }
    res.render('admin-options', { data: results, currentView: 'couriers' });
  });
});

// Add a new courier
router.post('/admin-options/couriers/add', isAdmin, (req, res) => {
  const { name, price } = req.body;
  const query = 'INSERT INTO couriers (name, price) VALUES (?, ?)';
  connection.query(query, [name, price], (error) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send('Error adding courier');
    }
    res.redirect('/admin-options/couriers');
  });
});

// Edit courier form
router.get('/admin-options/couriers/edit/:id', isAdmin, (req, res) => {
  const query = 'SELECT * FROM couriers WHERE id_courier = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error || results.length === 0) {
      console.error(error?.message);
      return res.status(500).send('Error fetching courier');
    }
    res.render('edit-courier', { courier: results[0] });
  });
});

// Update courier
router.post('/admin-options/couriers/edit/:id', isAdmin, (req, res) => {
  const { name, price } = req.body;
  const query = 'UPDATE couriers SET name = ?, price = ? WHERE id_courier = ?';
  connection.query(query, [name, price, req.params.id], (error) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send('Error updating courier');
    }
    res.redirect('/admin-options/couriers');
  });
});

// Delete courier
router.get('/admin-options/couriers/delete/:id', isAdmin, (req, res) => {
  const query = 'DELETE FROM couriers WHERE id_courier = ?';
  connection.query(query, [req.params.id], (error) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send('Error deleting courier');
    }
    res.redirect('/admin-options/couriers');
  });
});

// Show orders
router.get('/admin-options/orders', isAdmin, (req, res) => {
  const query = `
    SELECT 
      orders.id_order, 
      users.name, 
      users.last_name, 
      orders.date, 
      orders.address, 
      orders.courier, 
      orders.payment_method, 
      orders.status 
    FROM orders 
    JOIN users ON orders.id_user=users.id_user`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send('Error fetching orders');
    }
    res.render('admin-options', { data: results, currentView: 'orders' });
  });
});

// Update order status
router.post('/admin-options/orders/update/:id', isAdmin, (req, res) => {
  const { status } = req.body;
  const query = 'UPDATE orders SET status = ? WHERE id_order = ?';
  connection.query(query, [status, req.params.id], (error) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send('Error updating order status');
    }
    res.redirect('/admin-options/orders');
  });
});

// Show products
router.get('/admin-options/products', isAdmin, (req, res) => {
  const productQuery = `
    SELECT 
      products.product_id,
      products.name, 
      products.price, 
      categories.name AS category_name, 
      products.description, 
      products.quantity 
    FROM products 
    JOIN categories ON products.category_id=categories.id_category`;

  const categoryQuery = 'SELECT id_category, name FROM categories';

  connection.query(categoryQuery, (categoryError, categories) => {
    if (categoryError) {
      console.error(categoryError.message);
      return res.status(500).send('Error fetching categories');
    }

    connection.query(productQuery, (productError, products) => {
      if (productError) {
        console.error(productError.message);
        return res.status(500).send('Error fetching products');
      }

      res.render('admin-options', { data: products, currentView: 'products', categories: categories });
    });
  });
});

// Route to add a new product
router.post('/admin-options/products/add', upload.single('img_file'), (req, res) => {
  const {
    name, price, category_id, description, quantity,
    product_type, hex_color, size, brand, fabric,
    gender, configurable_id
  } = req.body;
  const img_file = req.file ? req.file.filename : null;

  const sql = `INSERT INTO products (name, price, category_id, img_file, description, quantity, product_type, hex_color, size, brand, fabric, gender, configurable_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [
    name, price, category_id, img_file, description, quantity,
    product_type, hex_color, size, brand, fabric, gender, configurable_id || null
  ], (error) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send("Błąd przy dodawaniu produktu");
    }
    res.redirect('/admin-options/products');
  });
});

// Edit product form
router.get('/admin-options/products/edit/:id', isAdmin, (req, res) => {
  const query = 'SELECT * FROM products WHERE product_id = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error || results.length === 0) {
      console.error(error?.message);
      return res.status(500).send('Error fetching product');
    }
    res.render('edit-product', { product: results[0] });
  });
});

// Update product
router.post('/admin-options/products/edit/:id', isAdmin, (req, res) => {
  const { price, quantity } = req.body;
  const query = 'UPDATE products SET price = ?, quantity = ? WHERE product_id = ?';
  connection.query(query, [price, quantity, req.params.id], (error) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send('Error updating product');
    }
    res.redirect('/admin-options/products');
  });
});

// Delete product
router.get('/admin-options/products/delete/:id', isAdmin, (req, res) => {
  const query = 'DELETE FROM products WHERE product_id = ?';
  connection.query(query, [req.params.id], (error) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send('Error deleting product');
    }
    res.redirect('/admin-options/products');
  });
});

// Show users
router.get('/admin-options/users', isAdmin, (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send('Error fetching users');
    }
    res.render('admin-options', { data: results, currentView: 'users' });
  });
});

// Edit user form
router.get('/admin-options/users/edit/:id', isAdmin, (req, res) => {
  const query = 'SELECT * FROM users WHERE id_user = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error || results.length === 0) {
      console.error(error?.message);
      return res.status(500).send('Error fetching user');
    }
    res.render('edit-user', { user: results[0] });
  });
});

// Update user
router.post('/admin-options/users/edit/:id', isAdmin, (req, res) => {
  const { name, last_name, address, phone_number, email } = req.body;
  const query = 'UPDATE users SET name = ?, last_name = ?, address = ?, phone_number = ?, email = ? WHERE id_user = ?';
  connection.query(query, [name, last_name, address, phone_number, email, req.params.id], (error) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send('Error updating user');
    }
    res.redirect('/admin-options/users');
  });
});

// Delete user
router.get('/admin-options/users/delete/:id', isAdmin, (req, res) => {
  const query = 'DELETE FROM users WHERE id_user = ?';
  connection.query(query, [req.params.id], (error) => {
    if (error) {
      console.error(error.message);
      return res.status(500).send('Error deleting user');
    }
    res.redirect('/admin-options/users');
  });
});

module.exports = router;