import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
  price: { type: Number, required: true },
  image: String,
  active: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.model('Promotion', promotionSchema);
