const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const bodyParser = require("body-parser");

app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  console.log("hellow ji");
  res.send("welcome my friends");
});

const router = require("./router/index");
const db = require("./models/index.js");

// app.use(db);
app.use(router);

const port = process.env.PORT || 3000;

console.log(port);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
