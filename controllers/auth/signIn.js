const User = require("../../models/client/brandUserDetail");
const express = require("express");
// const User = require("../models/User");
const auth = require("../../middleware/auth");

exports.signInUser = async (req, res) => {
  //Login a registered user
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();

    const name = await user.brandName;

    res.send({ status: true, name, token });
  } catch (error) {
    res.status(400).send({ status: false, error });
  }
};
