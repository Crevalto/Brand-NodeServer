// getting mongoose instance
const mongoose = require("mongoose");

// getting schema instance
const Schema = mongoose.Schema;

// creating videoRenderQueue Schema
const videoRenderQueueSchema = new Schema(
  {
    brandAssociated: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "UserDetail",
    },
    merchantAssociated: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "MerchantDetail",
    },
    videoId: {
      type: String,
      required: true,
    },
    renderStatus: {
      type: Boolean,
      required: true,
    },
    renderedURL: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// creating model and exporting it
module.exports = mongoose.model("videorenderqueue", videoRenderQueueSchema);
