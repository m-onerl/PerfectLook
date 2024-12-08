const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const routing = require("./routings");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/public");
app.use(routing);

app.listen(port, () => {
  console.log(`Aplikacja uruchomiona jest na localhost:${port}`);
});
