import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import medicationRoutes from './routes/medications.js';
import doseRoutes from './routes/doses.js';
import telemetryRoutes from './routes/telemetry.js';
import alertRoutes from './routes/alerts.js';
import { startAdherenceScheduler } from './services/adherenceScheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/doses', doseRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/alerts', alertRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MediSmart Backend Server',
    time: new Date().toISOString(),
    version: '2.4.0'
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    message: 'MediSmart Node.js & Supabase IoT Backend API is running.',
    docs: '/api/health'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 MediSmart Node.js API Server running on port ${PORT}`);
  console.log(`📡 IoT Telemetry endpoint: http://localhost:${PORT}/api/telemetry/lid-event`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
  
  // Start background adherence cron
  startAdherenceScheduler();
});
