const mongoose = require("mongoose");

// importing the required database model
const VendorProducts = require("../../models/vendor/vendorProduct");

// function that returns all products of given category
exports.getProducts = (req, res, next) => {
  // getting the bodyparser parsed body
  let categoryId;

  try {
    categoryId = mongoose.Types.ObjectId(req.body["categoryId"]);
  } catch (err) {
    res.send({ status: false, error: "Invalid category Id" });
  }

  // fetching all categories from the database
  VendorProducts.find({ category: categoryId }, function (err, products) {
    var prodMap = [];

    products.forEach(function (product) {
      prodMap.push(product);
    });

    res.send({ status: true, products: prodMap });
  });
};
