import mongoose from 'mongoose';

const categoryImageSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  image: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.model('CategoryImage', categoryImageSchema);
