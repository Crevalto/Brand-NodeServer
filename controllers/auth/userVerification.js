// requiring required models
const User = require("../../models/client/brandUserDetail");

// called to set user are verified user
module.exports.setUserAsVerified = async (req, res, next) => {
  // getting the brand email address
  const brandEmailAddress = req.body["emailAddress"];

  // getting the user in question
  const user = await User.findOne({ emailAddress: brandEmailAddress });
  // checking if user exsists
  if (!user)
    res.send({
      status: false,
      error: "No user found for the given email address",
    });
  // checking if user is already verified
  if (user.verifiedUser)
    res.send({ status: false, error: "User already verified" });
  // updating the verified user value for the particular user
  User.findByIdAndUpdate(
    user._id,
    { verifiedUser: true },
    { new: true },
    (err, user) => {
      // catching returning error
      if (err)
        res.status(500).send({ status: false, error: "Internal Server Error" });
    }
  );

  // sending back response to user
  res.send({ status: true, message: "Your account has been verified" });
};
