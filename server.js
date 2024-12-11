const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const MemoryStore = require("memorystore")(session);
const crypto = require("crypto");
const routing = require("./routings");

const app = express();
const port = 3000;


app.use(compression());


app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});




app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000, 
    }),
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/public");


app.use(routing);


app.listen(port, () => {
  console.log(`Aplikacja uruchomiona jest na http://localhost:${port}`);
});
