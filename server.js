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

// Middleware do kompresji
app.use(compression());

// Generowanie unikalnego nonce dla każdego żądania
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});

// Helmet z polityką CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

// Konfiguracja sesji z MemoryStore
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000, // Przechowywanie sesji przez 1 dzień
    }),
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Ustaw na true, jeśli korzystasz z HTTPS
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Ustawienie katalogu publicznego
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/public");

// Routing
app.use(routing);

// Serwer nasłuchuje na określonym porcie
app.listen(port, () => {
  console.log(`Aplikacja uruchomiona jest na http://localhost:${port}`);
});
