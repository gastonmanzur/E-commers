import mongoose from 'mongoose';

const highlightCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.model('HighlightCategory', highlightCategorySchema);
