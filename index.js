// importing required packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// creating express middleware
const app = express();
// adding bodyParser to encodeURL and helping parse JSON body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importing routes
const brandRoutes = require("./routes/brandRoutes");

// defining routes
app.use("/brand", brandRoutes);

// connecting to database
mongoose
  .connect(
    "mongodb+srv://rohitraj:shanthiraj1310@cluster0-h68h8.mongodb.net/crevaltodb?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then((result) => {
    // starting listener on ports
    app.listen(9000);
    console.log("started server");
  })
  .catch((err) => {
    console.log("Error Occurred during database connection: " + err);
  });
