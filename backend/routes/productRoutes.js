import express from 'express';
import Product from '../models/Product.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo producto
router.post('/', protect, isAdmin, async (req, res) => {
  const { name, description, price, images = [], category, inStock, stock } = req.body;
  if (images.length > 3) return res.status(400).json({ message: 'Máximo 3 imágenes' });
  const product = new Product({ name, description, price, images, category, inStock, stock });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Ajustar stock de un producto
router.patch('/:id/stock', async (req, res) => {
  const { change } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    const newStock = (product.stock || 0) + Number(change);
    if (newStock < 0) {
      return res.status(400).json({ message: 'Sin stock disponible' });
    }
    product.stock = newStock;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
