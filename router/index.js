const express = require("express");
const grocery = require("../controller/index.js");
const router = express.Router();
// const groceryInstance = new Grocery();

router.post("/register", grocery.registerApi);
// {
//     "name":"sandeep",
//     "email":"osho@gmail.com",
//     "password":"1234",
//     "passwordConfirm":"123"
// }

router.post("/login", grocery.login);
// {
//     "email":"osho@gmail.com",
//     "password":"1234",
// }

router.post("/addNewGrocery", grocery.addNewGrocery);
// const arr = [
//     {
//       name: "maggie",
//       price: 15,
//       quantity_left: 10,
//     },
//     {
//       name: "appyfiz",
//       price: 20,
//       quantity_left: 10,
//     },
//     {
//       name: "kurkure",
//       price: 20,
//       quantity_left: 20,
//     },
//     {
//       name: "chips",
//       price: 20,
//       quantity_left: 30,
//     },
//   ];

router.get("/veiwGrocery", grocery.veiwGrocery);

router.post("/updateGrocery", grocery.updateGrocery);
module.exports = router;
