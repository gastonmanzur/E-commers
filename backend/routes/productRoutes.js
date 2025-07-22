import express from 'express';
import Product from '../models/Product';

const router = express.Router();

// Obtener todos los producctos
router.get('/', async (requestAnimationFrame, res) => {
    try{
        const products = await Product.find();
        res.json(products);
    } catch (err){
        res.status(500).json({ message: err.message })
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    const { name, description, price, image, category, inStock} = req.body;
    const product = new Product({ name, description, price, image, category, inStock });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch {
        res.status(400).json({ message: err.message});
    }
});

export default router;