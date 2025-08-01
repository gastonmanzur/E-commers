import express from 'express';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';
import CategoryImage from '../models/CategoryImage.js';

const router = express.Router();

// Get all category images
router.get('/', async (req, res) => {
  try {
    const images = await CategoryImage.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Set image for a specific category
router.put('/:category', protect, isAdmin, async (req, res) => {
  const { category } = req.params;
  const { image } = req.body;
  if (!image) return res.status(400).json({ message: 'Imagen requerida' });
  try {
    let doc = await CategoryImage.findOne({ category });
    if (doc) {
      doc.image = image;
    } else {
      doc = new CategoryImage({ category, image });
    }
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
