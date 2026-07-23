import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

// Inicializar el adaptador de base de datos para PostgreSQL (Requerido en Prisma 7+)
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Exportar una única instancia de Prisma para toda la app
const prisma = new PrismaClient({ adapter });

export default prisma;
