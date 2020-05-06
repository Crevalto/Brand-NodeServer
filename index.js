// importing required packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

// creating express middleware
const app = express();
// adding bodyParser to encodeURL and helping parse JSON body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importing routes
const brandRoutes = require("./routes/brandRoutes");
app.use(cors());
// defining routes
app.use("/brand", brandRoutes);

// connecting to database
mongoose
  .connect(
    "mongodb://localhost:27017/crevaltodb?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then((result) => {
    // starting listener on ports
    app.listen(4000);
    console.log("started server");
  })
  .catch((err) => {
    console.log("Error Occurred during database connection: " + err);
  });
