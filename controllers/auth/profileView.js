const User = require("../../models/client/brandUserDetail");
const express = require("express");
// const User = require("../models/User");
const auth = require("../../middleware/auth");

exports.profileView = async (req, res) => {
  // View logged in user profile

  try {
    // console.log(req.body);
    const bName = req.params.brandName; //gets the email and password of the user

    const user = await User.findByBrandName({ brandName: bName });

    //if success gets brand name,Id,logo and phone number of the profile logged in
    const bname = user.brandName;
    const baddress = user.brandAddress;
    const bid = user.identificationDetail;
    const phn_no = user.phoneNo;
    const bemail = user.emailAddress;
    const brandAssets = user.brandAssets;
    /// sends tthe status and the collected details of user

    res.send({
      satus: true,
      bname,
      bid,
      baddress,
      bemail,
      phn_no,
      brandAssets,
    });
  } catch (error) {
    /// sends the status and the error in case of failed login/Userprofileview
  }

  res.status(400).send({
    status: false,
    error: "Sorry ,No such profile exists",
  });
};
