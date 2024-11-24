const express = require('express');
const router = express.Router();
const connection = require('../dbConnect');

router.get("/login", (req, res) => {
    if (req.session.user) res.redirect("/");
    else res.render("login");
});

router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        const errorMessage = "Wprowadź nazwę użytkownika i hasło.";
        return res.render("login", { errorMessage, username });
    }

    const sql = "SELECT * FROM users WHERE login = ? AND password = ?";
    connection.query(sql, [username, password], function (err, result) {
        if (err) {
            console.error(err.message);
            return;
        }
        if (result.length === 0) {
            const errorMessage = "Nieprawidłowy login lub hasło";
            console.log(errorMessage);
            return res.render("login", { errorMessage, username });
        }
        const id_user = result[0].id_user;
        req.session.user = { id_user: id_user };
        console.log("Prawidłowe dane");
        res.redirect("/");
    });
});

router.get("/logout", (req, res) => {
    req.session.destroy(); 
    console.log("Wylogowano pomyślnie.");
    res.redirect("/login");
});

router.get('/session-status', (req, res) => {
    if (req.session.user) {
      res.json({ loggedIn: true });
    } else {
      res.json({ loggedIn: false });
    }
});

module.exports = router;
