import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import prisma from './prisma.js';

import eventRoutes from './routes/eventRout.js';
import guestRoutes from './routes/guestRout.js';
import tableRoutes from './routes/tableRoute.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// Configurar CORS
app.use(cors());
app.use(express.json());

// Ruta de estado del servidor (Health check)
app.get('/health', async (req, res) => {
  try {
    // Consulta simple para verificar la conexión con la base de datos
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      message: 'Server is healthy and connected to the database',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server is running but database connection failed',
      error: error.message,
      timestamp: new Date()
    });
  }
});

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TableFlow API!',
    endpoints: {
      health: '/health',
      events: '/api/events',
      guests: '/api/guests',
      tables: '/api/tables'
    }
  });
});

// Rutas de la API
app.use('/api/events', eventRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/auth', authRoutes);

// Levantar el servidor
app.listen(port, () => {
  console.log(`🚀 TableFlow backend server running on http://localhost:${port}`);
});
