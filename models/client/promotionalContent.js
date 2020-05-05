// getting mongoose instance
const mongoose = require("mongoose");

// getting schema instance
const Schema = mongoose.Schema;

// creating promotionalContent Schema
const promotionalContentSchema = new Schema({
  brandAssociated: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  merchantAssociated: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  contentName: {
    type: String,
    required: true,
  },
  contentURL: {
    type: String,
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

// creating model and exporting it
module.exports = mongoose.model("promotionalContent", promotionalContentSchema);
