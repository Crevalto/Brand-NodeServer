// getting mongoose instance
const mongoose = require("mongoose");
//const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// getting schema instance
const Schema = mongoose.Schema;

// creating userDetail Schema
const userDetailSchema = new Schema({
  bandName: {
    type: String,
    required: true,
  },
  accountPassword: {
    type: String,
    required: true,
    minlength: 7,
  },
  brandAddress: {
    type: String,
    required: true,
  },
  identificationDetail: {
    regNo: String,
    cinNo: String,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  brandAssets: {
    brandLogoSrc: String,
    brandColor: String,
    brandSoundTrack: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userDetailSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("accountPassword")) {
    user.accountPassword = await bcrypt.hash(user.accountPassword, 8);
  }
  next();
});

userDetailSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;

  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  console.log("ASDFASDFASDF");
  // user.tokens = user.tokens.concat({ token });
  // await user.save();
  // return token;
};

userDetailSchema.statics.findByCredentials = async (email, accountPassword) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isPasswordMatch = await bcrypt.compare(
    accountPassword,
    user.accountPassword
  );
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return user;
};

module.exports = mongoose.model("branduserdetail", userDetailSchema);
