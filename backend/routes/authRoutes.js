// backend/routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import protect from '../middleware/authMiddleware.js';
import User from '../models/User.js';


const router = express.Router();

// Crear JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Registro de usuario
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword, adminCode } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'El usuario ya existe' });

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Las contrase\u00f1as no coinciden' });
    }

    const role = adminCode && adminCode === process.env.ADMIN_CODE ? 'admin' : 'cliente';
    const user = await User.create({ name, email, password, role });

    const verifyToken = generateToken(user._id);
    const url = `${process.env.BASE_URL}/api/users/verify/${verifyToken}`;

    // enviar email de verificaci\u00f3n
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Confirma tu cuenta',
      html: `<p>Confirma tu cuenta haciendo clic <a href="${url}">aqu\u00ed</a></p>`
    });

    res.status(201).json({
      message: 'Usuario registrado, revisa tu email para confirmar',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Confirmaci\u00f3n de cuenta
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    user.verified = true;
    await user.save();
    res.send('Cuenta verificada');
  } catch (err) {
    res.status(400).json({ message: 'Token no v\u00e1lido' });
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
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login con Google
router.post('/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({ idToken: token });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: jwt.sign({ email }, process.env.JWT_SECRET) });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(400).json({ message: 'Token de Google inválido' });
  }
});


router.get('/profile', protect, async (req, res) => {
  res.json({
    message: `Bienvenido, ${req.user.name}`,
    user: req.user,
  });
});



export default router;
