// getting mongoose instance
const mongoose = require("mongoose");

// getting schema instance
const Schema = mongoose.Schema;

const brandAssetSchema = new Schema({
    brandUserId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    assetType: {
        type: String,
        required: true
    },
    assetLocation: {
        type: String,
        required: true
    },
    assetBucket: {
        type: String,
        required: true
    },
    assetName: {
        type: String,
        required: true
    }
});

// exporting the model
module.exports = mongoose.model('brandAsset', brandAssetSchema);