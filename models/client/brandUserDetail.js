// getting mongoose instance
const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("branduserdetail", userDetailSchema);
