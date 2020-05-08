const User = require("../../models/client/brandUserDetail");

// const User = require("../models/User");
//const auth = require("../../middleware/auth");

exports.signInUser = async (req, res) => {
  //Login a registered user
  try {
    const { emailAddress, accountPassword } = req.body;

    const user = await User.findByCredentials(emailAddress, accountPassword);
    if (!user) {
      return res
        .status(401)
        .send({ status: false, error: "Invalid credentials, please verify" });
    }
    const token = await user.generateAuthToken();

    const name = await user.bandName;

    res.send({ status: true, name, token });
  } catch (error) {
    console.log(error);

    res
      .status(400)
      .send({ status: false, error: "Username or password is incorrect" });
  }
};
