// backend/routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import protect from '../middleware/authMiddleware.js';
import User from '../models/User.js';


const router = express.Router();

// Crear JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Registro de usuario
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'El usuario ya existe' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/profile', protect, async (req, res) => {
  res.json({
    message: `Bienvenido, ${req.user.name}`,
    user: req.user,
  });
});



export default router;
