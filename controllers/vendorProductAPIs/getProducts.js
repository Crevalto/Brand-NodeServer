// importing the required database model
const VendorProducts = require("../../models/vendor/vendorProduct");

// function that returns all products of given category
exports.getProducts = (req, res, next) => {
  // getting the bodyparser parsed body
  const reqBody = req.body;

  // fetching all categories from the database
  VendorProducts.find({ category: reqBody.categoryId }, function (
    err,
    products
  ) {
    var prodMap = [];

    products.forEach(function (product) {
      prodMap.push(product);
    });

    res.send(prodMap);
  });
};
