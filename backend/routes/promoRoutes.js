import express from 'express';
import Promotion from '../models/Promotion.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

// Obtener promociones activas
router.get('/', async (req, res) => {
  try {
    const promos = await Promotion.find({ active: true }).populate('products');
    res.json(promos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear nueva promoción
router.post('/', protect, isAdmin, async (req, res) => {
  const { name, description, products = [], price, image, active = true } = req.body;
  if (!name || !Array.isArray(products) || products.length === 0 || price === undefined) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }
  try {
    const promo = await Promotion.create({ name, description, products, price, image, active });
    res.status(201).json(promo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
