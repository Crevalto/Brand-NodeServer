// getting mongoose instance
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// getting schema instance
const Schema = mongoose.Schema;

// creating userDetail Schema
const userDetailSchema = new Schema({
  brandName: {
    type: String,
    required: true,
    unique: true,
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
    type: String,
    required: true,
  },
  brandAssets: {
    brandLogoSrc: String,
    brandColor: String,
    brandSoundTrack: String,
  },
  verifiedUser: {
    type: Boolean,
    required: true,
    default: false,
  },
  token: {
    type: String,
  },
});

userDetailSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("accountPassword")) {
    user.accountPassword = await bcrypt.hash(user.accountPassword, 8);
  }
  next();
});
// Generate an auth token for the user
userDetailSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env["JWT_KEY"]);
  user.token = token;
};

userDetailSchema.statics.findByCredentials = async (
  emailAddress,
  accountPassword
) => {
  const userModel = mongoose.model("branduserdetail", userDetailSchema);

  // Search for a user by email and password.
  const user = await userModel.findOne({ emailAddress: emailAddress });

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

userDetailSchema.statics.findByBrandName = async (bandName) => {
  const userModel = mongoose.model("branduserdetail", userDetailSchema);

  const user = await userModel.findOne(bandName);
  if (!user) {
    throw new Error({ error: "User doesn't exist" });
  }

  return user;
};

module.exports = mongoose.model("branduserdetail", userDetailSchema);
