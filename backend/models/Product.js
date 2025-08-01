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
  gender: {
    type: String,
    enum: ['femenino', 'masculino', 'unisex'],
    default: 'unisex'
  },
  inStock: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
