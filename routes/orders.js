
const express = require('express');
const router = express.Router();
const db = require('../dbConnect'); // Adjust the path as needed

function requireLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      next();
    }
  }

router.get('/my-orders', requireLogin, (req, res) => {


  const userId = req.session.user.id_user;
  const query = 'SELECT * FROM orders WHERE id_user = ? ORDER BY date DESC';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('my-orders', { orders: results });
  });
});
router.get('/order-items/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const query = `
      SELECT products.name, order_ele.quantity 
      FROM order_ele 
      JOIN products ON order_ele.id_product = products.product_id 
      WHERE order_ele.id_order = ?
    `;
  
    db.query(query, [orderId], (err, results) => {
      if (err) {
        console.error('Error fetching order items:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results);
    });
  });

module.exports = router;