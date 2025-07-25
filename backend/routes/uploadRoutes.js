import express from 'express';
import fs from 'fs';
import path from 'path';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, isAdmin, (req, res) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ message: 'Sin datos' });
    const match = data.match(/^data:(.+);base64,(.+)$/);
    if (!match) return res.status(400).json({ message: 'Formato inválido' });
    const ext = match[1].split('/')[1] || 'png';
    const buffer = Buffer.from(match[2], 'base64');
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
    const filename = `${Date.now()}.${ext}`;
    fs.writeFileSync(path.join('uploads', filename), buffer);
    res.json({ url: `/uploads/${filename}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
