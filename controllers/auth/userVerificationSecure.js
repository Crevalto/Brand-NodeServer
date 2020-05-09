const mongoose = require("mongoose");

// importing required models
const OTPCollection = require("../../models/client/otpCollection");
const User = require("../../models/client/brandUserDetail");

// otp verification method
module.exports.otpVerification = async (req, res, next) => {
  // declaring userId holding variable
  let reqUserId;

  // getting user details
  try {
    reqUserId = mongoose.Types.ObjectId(req.body["userId"]);
  } catch (err) {
    res.send({ status: true, message: "Invalid user ID" });
  }

  const reqOtpCode = req.body["otpCode"];

  // getting the instance of collection with the user ID
  const userOTPCollection = await OTPCollection.findOne({
    userId: reqUserId,
  });

  // checking if an user OTP collection exists
  if (userOTPCollection != null) {
    // check if the otp is valid
    if (userOTPCollection.otpCode == reqOtpCode) {
      // updating the current user database document
      await User.findByIdAndUpdate(
        reqUserId,
        { verifiedUser: true },
        (error, result) => {
          if (error === null) return result;
          else {
            console.log(error);
            return null;
          }
        }
      );

      // deleting the user's otp collection
      await OTPCollection.deleteOne({ userId: reqUserId });
      // sending response
      res.send({ status: true, message: "User verified successfully" });
    } else {
      res.send({ status: false, error: "OTP does not match" });
    }
  } else {
    res.send({ status: false, error: "User has not generated an OTP" });
  }
};
