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
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/public");
app.use(routing);

app.listen(port, () => {
  console.log(`Aplikacja uruchomiona jest na http://135.125.155.141:${port}`);
});
