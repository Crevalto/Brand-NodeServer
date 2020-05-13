// importing required modules
const mongoose = require("mongoose");
const jwt_decode = require("jwt-decode");

// importing required models
const User = require("../../models/client/brandUserDetail");

// gets the userID from the token
const getUsetId = async (token) => {
  //token gets Bearer in addition so split it in newtoken using variable val and split(" ")
  var val = token.split(" ");
  const newtoken = val[1];
  //decoding token --(method jwt_decode)-->id,iat..(iat-time period of the token)
  const decodedvalue = await jwt_decode(token);
  //taking user id fom the decoded token and returning it
  return decodedvalue._id;
};

// adds item to cart
module.exports.addItemToCart = async (req, res, next) => {
  try {
    // fetching the item array
    const itemRefs = req.body["itemsRefs"];
    // fetching the quantity of items
    const itemQuantities = req.body["itemQuants"];
    // gets the token for user identification
    const token = req.headers.authorization;
    // getting the userId from the token
    const userId = await getUsetId(token);

    // get reference of user based on the userID
    const user = await User.findById(userId, (err, doc) => {
      if (err) {
        console.log(
          "An error occurred in finding the user based on decoded ID"
        );
        res.send({
          status: false,
          error: "An error occurred in finding the user based on decoded ID",
        });
      } else return doc;
    });

    // constructing object to add to database
    let cartItemObj = {
      itemId: itemRefs,
      itemQuantity: itemQuantities,
    };

    // fetching the cart array from the user
    let userExistingCart = await user.cart;

    // checking if the cart is yet undefined
    if (userExistingCart === undefined) {
      // creating the cart array
      userExistingCart = [];
    } 
    // pushing the current object to the cart
    userExistingCart[userExistingCart.length] = cartItemObj;
    // updating the database with the new item in the cart
    await User.findByIdAndUpdate(userId, { cart: userExistingCart });

    // sending final response
    res.send({ status: true, message: "Item added to cart!" });
  } catch (err) {
    // logging error
    console.log("Error occured in main method");
    if (!res.headersSent)
      res.send({
        status: false,
        error: "Error occured, please contact admin Error: " + err,
      });
  }
};
