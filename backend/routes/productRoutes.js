import express from 'express';
import Product from '../models/Product.js';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const { search, gender } = req.query;
    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    if (gender && ['femenino','masculino','unisex'].includes(gender)) {
      filter.gender = gender;
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener productos destacados
router.get('/featured', async (req, res) => {
  try {
    const featured = await Product.find({ featured: true }).sort({ updatedAt: -1 }).limit(6);
    res.json(featured);
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
  const { name, description, price, images = [], category, gender = 'unisex', inStock, stock } = req.body;
  if (images.length > 3) return res.status(400).json({ message: 'Máximo 3 imágenes' });
  const product = new Product({ name, description, price, images, category, gender, inStock, stock });

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

// Marcar un producto como destacado
router.put('/:id/featured', protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    product.featured = true;
    await product.save();
    const extras = await Product.find({ featured: true }).sort({ updatedAt: -1 }).skip(6);
    for (const p of extras) {
      p.featured = false;
      await p.save();
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un producto
router.put('/:id', protect, isAdmin, async (req, res) => {
  const { name, description, price, images = [], category, gender = 'unisex', inStock, stock } = req.body;
  if (images.length > 3) return res.status(400).json({ message: 'Máximo 3 imágenes' });
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    product.name = name;
    product.description = description;
    product.price = price;
    product.images = images;
    product.category = category;
    product.gender = gender;
    product.inStock = inStock;
    if (stock !== undefined) product.stock = stock;
    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Establecer el stock de un producto
router.put('/:id/stock', protect, isAdmin, async (req, res) => {
  const { stock } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    if (stock < 0) return res.status(400).json({ message: 'El stock no puede ser negativo' });
    product.stock = stock;
    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un producto
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    await product.deleteOne();
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
