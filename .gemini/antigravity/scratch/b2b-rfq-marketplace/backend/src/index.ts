import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import rfqRoutes from './routes/rfqRoutes';
import quotationRoutes from './routes/quotationRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for dev/easy testing
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), message: 'B2B RFQ Marketplace API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rfqs', rfqRoutes);
app.use('/api/quotations', quotationRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
});

export default app;
