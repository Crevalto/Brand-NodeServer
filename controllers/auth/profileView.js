const User = require("../../models/client/brandUserDetail");
const express = require("express");
// const User = require("../models/User");
const auth = require("../../middleware/auth");

exports.profileView = async (req, res) => {
  // View logged in user profile

  try {
    // console.log(req.body);
    const brandName = req.params.brandName; //gets the email and password of the user

    const user = await User.findByBrandName({ bandName: brandName }); //extracts the user using mail and password
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" }); //If user not present
    }

    const bname = await user.bandName;
    const bid = await user.identificationDetail; //if success gets brand name,Id,logo and phone number of the profile logged in
    const br_logo = await user.brandAssets;
    const phn_no = await user.phoneNo;

    res.send({ satus: true, bname, bid, br_logo, phn_no }); /// sends tthe status and the collected details of user
  } catch (error) {
    res.status(400).send({
      status: false,
      error: "You must be logged in to view your profile",
    }); /// sends the status and the error in case of failed login/Userprofileview
  }
};
