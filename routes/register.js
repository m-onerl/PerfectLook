const express = require("express");
const router = express.Router();
const connection = require("../dbConnect");

router.get("/register", (req, res) => {
  if (req.session.user) res.redirect("/");
  else res.render("register");
});

router.post("/register", (req, res) => {
  const {
    login,
    email,
    password,
    confpassword,
    firstname,
    lastname,
    address,
    number,
  } = req.body;

  if (password !== confpassword) {
    console.log("Passwords do not match");
    res.render("register", { message: "Passwords do not match" });
    return;
  }

  const sql = "SELECT * FROM users WHERE login = ? OR email = ?";
  connection.query(sql, [login, email], (err, result) => {
    if (err) {
      console.error(err.message);
      res.render("register", {
        message: "Database error. Please try again later.",
      });
      return;
    }

    if (result.length === 0) {
      const insertSql =
        "INSERT INTO users (name, last_name, email, login, password, address, number, permission) VALUES (?, ?, ?, ?, ?, ?, ?, 'pracownik')";
      connection.query(
        insertSql,
        [firstname, lastname, email, login, password, address, number],
        (err) => {
          if (err) {
            console.error(err.message);
            res.render("register", {
              message: "Database error. Please try again later.",
            });
            return;
          }

          console.log("Registration successful");
          res.redirect("/login");
        }
      );
    } else {
      console.log("User with the given email/login already exists.");
      res.render("register", {
        message: "User with the given email/login already exists.",
      });
    }
  });
});

module.exports = router;
