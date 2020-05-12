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

    //extracts the user using mail and password
    // const check = await user.findOne(brandName);
    // console.log(check);
    // if (!check) {
    //   return res.status(401).send({ error: "no such profile exists" }); //If user not present
    // }

    //if success gets brand name,Id,logo and phone number of the profile logged in
    const bname = await user.brandName;
    const baddress = await user.brandAddress;
    const bid = await user.identificationDetail;
    const phn_no = await user.phoneNo;
    const bemail = await user.emailAddress;

    /// sends tthe status and the collected details of user

    res.send({ satus: true, bname, bid, baddress, bemail, phn_no });
  } catch (error) {
    /// sends the status and the error in case of failed login/Userprofileview
  }

  res.status(400).send({
    status: false,
    error: "Sorry ,No such profile exists",
  });
};
