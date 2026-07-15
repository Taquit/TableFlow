import prisma from './src/prisma.js';
import bcrypt from 'bcryptjs';

async function seed() {
    const existingAdmin = await prisma.user.findUnique({
        where: { username: 'admin' }
    });
    
    if (existingAdmin) {
        console.log('Admin already exists');
        process.exit(0);
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await prisma.user.create({
        data: {
            username: 'admin',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });
    
    console.log('Admin seeded successfully');
    process.exit(0);
}

seed();
