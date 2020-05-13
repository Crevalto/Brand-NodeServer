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

// fetches the items from the cart
module.exports.getCartItems = async (req, res, next) => {
  // gets the token for user identification
  const token = req.headers.authorization;
  // getting the userId from the token
  const userId = await getUsetId(token);
  // fetching instance of user from db
  const user = await User.findById(userId);
  // fetching the cart items for the user
  const cartItems = user.cart;

  // sending response
  res.send({ status: true, cartItems: cartItems });
};
