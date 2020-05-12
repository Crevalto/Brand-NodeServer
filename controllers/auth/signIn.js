// getting required models
const User = require("../../models/client/brandUserDetail");

exports.signInUser = async (req, res) => {
  //Login a registered user
  try {
    // fetching the authentication values from the request body
    const { emailAddress, accountPassword } = req.body;

    // finding user based on the credentials
    const user = await User.findByCredentials(emailAddress, accountPassword);
    // if user does not exists
    if (!user) {
      return res
        .status(401)
        .send({ status: false, error: "Invalid credentials, please verify" });
    }
    // checking if the user is a verified user
    if (user.verifiedUser) {
      // generating auth token for the user
      await user.generateAuthToken();
      // updating value in database
      const newUser = await User.findByIdAndUpdate(
        user._id,
        { token: user.token },
        { new: true },
        (err, user) => {
          // console.log(user);

          if (err)
            res.status(500).send({
              status: false,
              error: "Internal Server Error",
            });
          return user;
        }
      );
      // sending response for login
      res.send({
        status: true,
        name: newUser.brandName,
        token: newUser.token,
        verifiedUser: newUser.verifiedUser,
      });
    } else {
      // sending response for login
      res.send({
        status: false,
        name: user.brandName,
        verifiedUser: user.verifiedUser,
      });
    }
  } catch (error) {
    console.log(error);

    res
      .status(400)
      .send({ status: false, error: "Username or password is incorrect" });
  }
};
