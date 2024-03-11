const express = require("express");
const grocery = require("../controller/index.js");
const router = express.Router();
const middleware = require("../middleware/index.js");

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

router.post("/addNewGrocery", middleware.adminAuth, grocery.addNewGrocery);
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
router.post("/removeGrocery", middleware.adminAuth, grocery.removeGroceryItem);

router.get("/veiwGrocery", grocery.veiwGrocery);

router.post("/updateGrocery", middleware.adminAuth, grocery.updateGrocery);

router.post("/updateRole", grocery.changeRoles);

router.post("/order", middleware.checkToken, grocery.order);
// [
//     {
//       "name": "kurkure",
//       "quantity": 20
//     },
//     {
//       "name": "chips",
//       "quantity": 30
//     },
//     {
//       "name": "mouse",
//       "quantity": 30
//     }
//   ]
module.exports = router;
