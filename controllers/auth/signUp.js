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
      bandName: "covid",
      accountPassword: "covid1920",
      brandAddress: "chuna",
      identificationDetail: {
        regNo: "12345",
        cinNo: "abc1234",
      },
      emailAddress: "sam@sams.com",
      phoneNo: "9711223343",
      brandAssets: {
        brandLogoSrc: "logo",
        brandColor: "yellow",
        brandSoundTrack: "piano",
      },
    };

    const user = new User(userData);
    await user.save();

    const token = await user.generateAuthToken();

    // res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};
