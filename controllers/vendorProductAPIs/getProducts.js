const mongoose = require("mongoose");

// importing the required database model
const VendorProducts = require("../../models/vendor/vendorProduct");

// function that returns all products of given category
exports.getProducts = async (req, res, next) => {
  // getting the bodyparser parsed body
  let categoryId;

  try {
    categoryId = await mongoose.Types.ObjectId(req.body["categoryId"]);
    // fetching all categories from the database
    await VendorProducts.find({ category: categoryId }, (err, products) => {
      var prodMap = [];

      products.forEach(function (product) {
        prodMap.push(product);
      });

      res.send({ status: true, products: prodMap });
    });
  } catch (err) {
    res.send({ status: false, error: "Invalid category Id" });
  }
};
