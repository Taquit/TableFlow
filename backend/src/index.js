import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const app = express();
const port = process.env.PORT || 4000;

// Inicializar el adaptador de base de datos para PostgreSQL (Requerido en Prisma 7)
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Middlewares
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
      health: '/health'
    }
  });
});

// Levantar el servidor
app.listen(port, () => {
  console.log(`🚀 TableFlow backend server running on http://localhost:${port}`);
});
