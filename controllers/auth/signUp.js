// importing required packages
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  "829861943607-m2sn0viagga91u3d49417eujmdd8l1jp.apps.googleusercontent.com",
  "8ki2RSn8L5yVS7yh1B60bydj",
  "https://developers.google.com/oauthplayground"
);
// requiring required models
const User = require("../../models/client/brandUserDetail");
const OTPCollection = require("../../models/client/otpCollection");

// generates random number for OTP
const genOTP = () => {
  while (true) {
    var x = Math.floor(Math.random() * 9999 + 1000);
    if (x < 9999 && x > 1000) return x;
    else continue;
  }
};

// sends email to the user with the OTP
const sendEmailToUser = async (otpCode, emailAddress) => {
  oauth2Client.setCredentials({
    refresh_token: "Your Refresh Token Here",
  });
  const accessToken = oauth2Client.getAccessToken();
  // setting up mail transporter
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "rij7u7d2@gmail.com",
      pass: "shanthiraj13",
      clientId:
        "829861943607-m2sn0viagga91u3d49417eujmdd8l1jp.apps.googleusercontent.com",
      clientSecret: "8ki2RSn8L5yVS7yh1B60bydj",
      refreshToken:
        "1//04LGGqglIAktYCgYIARAAGAQSNwF-L9IroJ8bbVk5TLyvDfHdcBHMbKFGp_BHyuoeaJ4G_pGZ4ghT4Ojg_i_2Ed5c2q3zA3RV-rA",
      accessToken: accessToken,
    },
  });
  // setting up mail components
  var mailOptions = {
    from: "rij7u7d2@gmail.com",
    to: emailAddress,
    subject: "OTP for Sign UP!",
    text:
      "Your OTP is " + otpCode + ". Please keep it secret for god's sakes!!",
  };
  // returning promise
  return new Promise((resolve, reject) => {
    // sending mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error == null) resolve(true);
      else {
        resolve(error);
      }
    });
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
    // inserting data into database
    await user.save();
    // generating OTP code
    const otpCode = genOTP();
    // initiating mail sending function
    const mailSendResult = await sendEmailToUser(
      otpCode,
      userData.emailAddress
    );

    // inserting OTP details into the OTP collection
    const otpDocument = new OTPCollection({
      userId: user._id,
      otpCode: otpCode,
    });
    // saving the otp document into the collection
    await otpDocument.save();

    // // finding if the user has an OTP in collection
    // const updatedOTP = await OTPCollection.findOneAndUpdate(
    //   { user: user._id },
    //   { otpCode: otpCode },
    //   { new: true },
    //   (error, doc) => {
    //     if (error == null) return doc;
    //     else {
    //       console.log(error);
    //     }
    //   }
    // );
    // console.log(updatedOTP);
    // sending response
    res.status(201).send({
      status: true,
      otp: otpCode,
      userId: user._id,
      mailSent: mailSendResult,
    });
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
          case "minlength":
            errorMsg = "Password length shorter than 7 characters";
            break;
          default:
            errorMsg = error.errors[errName].message;
        }
      }
      // checking for mongoose error
      if (error.code === 11000) errorMsg = "User already exists in database";
    }
    res.send({ status: false, error: errorMsg });
  }
};
