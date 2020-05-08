// importing required packages
const nodemailer = require("nodemailer");

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

// sends email to the user with the OTP
const sendEmailToUser = async (OTPCode, emailAddress) => {
  // setting up mail transporter
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rij7u7d2@gmail.com",
      pass: "shanthiraj13",
    },
  });
  // setting up mail components
  var mailOptions = {
    from: "rij7u7d2@gmail.com",
    to: emailAddress,
    subject: "OTP for Sign UP!",
    text:
      "Your OTP is " + OTPCode + ". Please keep it secret for god's sakes!!",
  };
  // sending mail
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {
      return true;
    }
  });
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
    // initiating mail sending function
    const mailSendResult = await sendEmailToUser(
      OTPCode,
      userData.emailAddress
    );
    // sending response
    res
      .status(201)
      .send({ status: true, otp: OTPCode, mailSent: mailSendResult });
  } catch (error) {
    console.log(error);

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
