import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import promoRoutes from './routes/promoRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';




dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('API Running');
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/promotions', promoRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
