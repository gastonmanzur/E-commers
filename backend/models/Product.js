import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true},
   descripcion: String,
   price: {type: Number, required: true},
   image: String,
   category: String,
   inStock: {type: Boolean, default: true },
}, {
    timestamps: true,
}); 

const Product = mongoose.model('Product', productSchema);
export default Product;