// getting mongoose instance
const mongoose = require("mongoose");

// getting schema instance
const Schema = mongoose.Schema;

// creating collection to store OTP details
const otpCollectionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  otpCode: {
    type: String,
    required: true,
  },
});

// creating model from schema
module.exports = mongoose.model("otpCollection", otpCollectionSchema);
