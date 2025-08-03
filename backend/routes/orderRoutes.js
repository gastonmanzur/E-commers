import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

// Crear una orden a partir de items
router.post('/', protect, async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Sin items' });
  }
  try {
    const populated = await Promise.all(items.map(async ({ product, quantity, reserved }) => {
      const prod = await Product.findById(product);
      if (!prod) throw new Error('Producto no encontrado');
      return { product: prod._id, quantity, price: prod.price, reserved };
    }));
    const total = populated.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await Order.create({ user: req.user._id, items: populated, total });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener mis ordenes
router.get('/my', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product');
  res.json(orders);
});

// Obtener todas las ordenes (admin)
router.get('/', protect, isAdmin, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
  res.json(orders);
});

// Obtener una orden
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Sin permiso' });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Id inválido' });
  }
});

export default router;
