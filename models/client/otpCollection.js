// getting mongoose instance
const mongoose = require("mongoose");

// getting schema instance
const Schema = mongoose.Schema;

// creating collection to store OTP details
const otpCollectionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  otpCode: {
    type: Number,
    required: true,
  },
});

// creating model from schema
module.exports = mongoose.model("otpCollection", otpCollectionSchema);
