const express = require("express");
require("dotenv").config();

const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

const port = process.env.PORT;
console.log(port)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
