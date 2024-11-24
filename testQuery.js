const connection = require("./dbConnect")

let sql = `SELECT * FROM users`;

connection.query(sql, [true], (error, results, fields) => {
  if (error) return console.error(error.message);
  console.log(results);
});
