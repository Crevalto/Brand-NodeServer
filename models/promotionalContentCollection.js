// getting mongoose instance
const mongoose = require("mongoose");

// getting schema instance
const Schema = mongoose.Schema;

// creating promotionalContent Schema
const promotionalContentSchema = new Schema({
  brandAssociated: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "UserDetail",
  },
  contentName: {
    type: String,
    required: true,
  },
  contentPath: {
    type: String,
    required: true,
  },
  brandApprovalStatus: {
    type: Boolean,
    required: true,
  },
  govtApprovalStatus: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("promotionalContent", promotionalContentSchema);
