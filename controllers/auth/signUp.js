// requiring required models
const User = require("../../models/client/brandUserDetail");
const express = require("express");
// const User = require("../models/User");
const auth = require("../../middleware/auth");

// creates new user in database
exports.signUpUser = async (req, res, next) => {
  const reqBody = req.body;
  try {
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
    const token = await user.generateAuthToken();

    const bandName = await user.bandName;
    res.status(201).send({ bandName, token });
  } catch (error) {
    res.status(400).send(error);
  }
};
