const express = require('express');
const router = express.Router();

router.get('/regulations', (req, res) => {
    res.render('regulations');
});

router.get('/policy', (req, res) => {
    res.render('policy');
});

router.get('/cookies', (req, res) => {
    res.render('cookies');
});

module.exports = router;
