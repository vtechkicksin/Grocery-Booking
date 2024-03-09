const express = require("express");
const Grocery = require("../controller/index.js");
const router = express.Router();
// const groceryInstance = new Grocery();

router.post("/register", Grocery.register);

module.exports = router;
