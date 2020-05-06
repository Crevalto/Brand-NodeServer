// requiring required models
const User = require("../../models/client/brandUserDetail");
const express = require("express");
// const User = require("../models/User");
const auth = require("../../middleware/auth");

// creates new user in database
exports.signUpUser = async (req, res, next) => {
  const reqBody = req.body;
  try {
    console.log(reqBody);

    const userData = {
      bandName: reqBody["bandName"],
      accountPassword: reqBody["accountPassword"],
      brandAddress: reqBody["brandAddress"],
      identificationDetail: {
        regNo: reqBody["regNo"],
        cinNo: reqBody["cinNo"],
      },
      emailAddress: reqBody["emailAddress"],
      phoneNo: reqBody["phoneNo"],
      brandAssets: {
        brandLogoSrc: reqBody["brandLogoSrc"],
        brandColor: reqBody["brandColor"],
        brandSoundTrack: reqBody["brandSoundTrack"],
      },
    };
    const user = new User(userData);
    const usertoken = await user.generateAuthToken();

    const bandName = await user.bandName;
    res
      .status(201)
      .send({ status: true, brandName: bandName, token: usertoken });
    // res.send({ status: true });
  } catch (error) {
    console.log(error);

    res.status(400).send(error);
  }
};
