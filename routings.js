// tu ustalamy jaki link gdzie ma przenosic uzytkownika

const express = require("express");
const router = express.Router();

const cartRoutes = require("./routes/cart");
const creatorRoutes = require("./routes/creator");
const decreaseQuantityRoutes = require("./routes/decrease-quantity");
const deleteRoutes = require("./routes/delete");
const homepageRoutes = require("./routes/homepage");
const loginRoutes = require("./routes/login");
const paymentRoutes = require("./routes/payment");
const productRoutes = require("./routes/product");
const registerRoutes = require("./routes/register");
const servicesRoutes = require("./routes/services");
const storeRoutes = require("./routes/store");
const randomRoutes = require("./routes/random");
const materials = require("./routes/materials");
const faqRoutes = require("./routes/faq");

router.use(cartRoutes);
router.use(creatorRoutes);
router.use(decreaseQuantityRoutes);
router.use(deleteRoutes);
router.use(homepageRoutes);
router.use(loginRoutes);
router.use(paymentRoutes);
router.use(productRoutes);
router.use(registerRoutes);
router.use(servicesRoutes);
router.use(storeRoutes);
router.use(randomRoutes);
router.use(materials);
router.use(faqRoutes);

module.exports = router;
