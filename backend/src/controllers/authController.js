import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 1. Intentar buscar en la tabla Admin
        const admin = await prisma.admin.findUnique({
            where: { username }
        });
        
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            const token = jwt.sign(
                { id: admin.id, username: admin.username, role: 'ADMIN' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            return res.json({
                success: true,
                token,
                user: { id: admin.id, username: admin.username, role: 'ADMIN' }
            });
        }
        
        // 2. Intentar buscar en la tabla User (espectadores)
        const user = await prisma.user.findUnique({
            where: { username }
        });
        
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            const token = jwt.sign(
                { id: user.id, username: user.username, role: 'VIEWER' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            return res.json({
                success: true,
                token,
                user: { id: user.id, username: user.username, role: 'VIEWER' }
            });
        }
        
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const seedAdmin = async (req, res) => {
    try {
        const existingAdmin = await prisma.admin.findUnique({
            where: { username: 'admin' }
        });
        
        if (existingAdmin) {
            return res.json({ success: true, message: 'Admin already exists' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        const admin = await prisma.admin.create({
            data: {
                username: 'admin',
                password: hashedPassword
            }
        });
        
        res.json({ success: true, message: 'Admin seeded successfully into Admin table' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
