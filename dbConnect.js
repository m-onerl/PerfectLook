// jak ktos chce sobie uzyc tego polaczenia zeby np wykonac jakas kwerende, to macie przyklad jak to zrobic w testQuery.js

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "meble",
});

connection.connect((err) => {
  if (err) return console.error(err.message);
  console.log('Connected to the MySQL server.');
});

module.exports = connection