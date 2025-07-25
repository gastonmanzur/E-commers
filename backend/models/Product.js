import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: {
    type: [String],
    validate: [arr => arr.length <= 3, 'Máximo 3 imágenes']
  },
  category: String,
  inStock: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
