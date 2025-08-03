import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  reserved: { type: Boolean, default: false },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [itemSchema],
  total: { type: Number, required: true },
  status: { type: String, default: 'pendiente' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
