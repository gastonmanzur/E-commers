import express from 'express';
import HighlightCategory from '../models/HighlightCategory.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const doc = await HighlightCategory.findOne();
    res.json(doc || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', protect, isAdmin, async (req, res) => {
  const { category } = req.body;
  if (!category) return res.status(400).json({ message: 'Categoría requerida' });
  try {
    let doc = await HighlightCategory.findOne();
    if (doc) {
      doc.category = category;
    } else {
      doc = new HighlightCategory({ category });
    }
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
