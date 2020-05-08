// requiring required models
const User = require("../../models/client/brandUserDetail");

// generates random number for OTP
const genOTP = () => {
  while (true) {
    var x = Math.floor(Math.random() * 9999 + 1000);
    if (x < 9999 && x > 1000) return x;
    else continue;
  }
};

// creates new user in database
exports.signUpUser = async (req, res, next) => {
  // getting request body
  const reqBody = req.body;

  try {
    // creating json document to insert into database
    const userData = {
      brandName: reqBody["brandName"],
      accountPassword: reqBody["accountPassword"],
      brandAddress: reqBody["brandAddress"],
      identificationDetail: {
        regNo: reqBody["identificationDetail"]["regNo"],
        cinNo: reqBody["identificationDetail"]["cinNo"],
      },
      emailAddress: reqBody["emailAddress"],
      phoneNo: reqBody["phoneNo"],
      verifiedUser: false,
      brandAssets: {
        brandLogoSrc: reqBody["brandAssets"]["brandLogoSrc"],
        brandColor: reqBody["brandAssets"]["brandColor"],
        brandSoundTrack: reqBody["brandAssets"]["brandSoundTrack"],
      },
    };
    // creating user document instance
    const user = new User(userData);
    // // creating token for user and adding it to model
    // await user.generateAuthToken();
    // inserting data into database
    await user.save();
    // generating OTP code
    const OTPCode = genOTP();

    // sending response
    res.status(201).send({ status: true, otp: OTPCode });
  } catch (error) {
    // creating instance of error message
    let errorMsg = "";

    // catching mongoose errors
    if ((error.name = "MongoError")) {
      // go through all validation type errors
      for (var errName in error.errors) {
        switch (error.errors[errName].kind) {
          case "required":
            errorMsg = "Please fill all required fields";
            break;
        }
      }
      // checking for mongoose error
      if (error.code === 11000) errorMsg = "User already exists in database";
    }
    res.send({ status: false, error: errorMsg });
  }
};
