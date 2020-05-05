// getting mongoose instance
const mongoose = require("mongoose");

// getting schema instance
const Schema = mongoose.Schema;

// creating videoRenderQueue Schema
const vendorCategory = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    categoryThumbnail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// creating model and exporting it
module.exports = mongoose.model("vendorcategorie", vendorCategory);
