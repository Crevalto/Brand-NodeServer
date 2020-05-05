// importing the required database model
const VendorCategories = require("../../models/vendor/vendorCategories");

// function that returns all categories of products
exports.getCategories = (req, res, next) => {
  // fetching all categories from the database
  VendorCategories.find({}, function (err, categories) {
    var catMap = {};

    categories.forEach(function (category) {
      catMap[category._id] = category;
    });

    res.send(catMap);
  });
};
