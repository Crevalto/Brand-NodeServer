const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    stockAddress: { type: String, required: true },
    salePrice: { type: Number, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    category: { type: String, required: true },
    productImages: { type: Buffer },
    proofOfSalePrice: { type: Buffer },
    taxDocument: { type: Buffer },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
)
const Product = mongoose.model('Product', productSchema)

module.exports = Product
