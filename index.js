// importing required packages
const express = require("express");
const bodyParser = require("body-parser");

// creating express middleware
const app = express();

// defining routes
app.use("/", (req, res, next) => {
  res.send(
    "We appreciate your interest. Please wait, development in progress!"
  );
});

// starting listener on ports
app.listen(4000);
