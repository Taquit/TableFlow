import prisma from '../prisma.js';

// Get all tables
export const getAllTables = async (request, response) => {
    try {
        const tables = await prisma.table.findMany();
        response.json({ success: true, tables });
    } catch (error) {
        response.status(500).json({ error: 'Error fetching tables from database' });
    }
};

// Get table by id
export const getTableById = async (request, response) => {
    try {
        // Extraemos el ID de los parámetros de la URL (ej. /api/tables/123)
        const { id } = request.params;

        const table = await prisma.table.findUnique({
            where: { id: id },
            include: { guests: true } // Opcionalmente puedes incluir a los invitados de esta mesa
        });

        if (!table) {
            return response.status(404).json({ success: false, error: 'table not found' });
        }

        response.json({ success: true, table });
    } catch (error) {
        console.error("Error en getTableById:", error);
        response.status(500).json({ success: false, error: 'Error fetching table by ID' });
    }
};

//Delet table
export const deleteTableById = async (request, response) => {
    try {
        const { id } = request.params;
        const table = await prisma.table.delete({
            where: { id: id }
        });
        response.json({ success: true, table });
    } catch (error) {
        response.status(500).json({ error: 'Error deleting table from database' });
    }
};

//create table
export const createTable = async (request, response) => {
    try {
        const { number, capacity } = request.body;
        const table = await prisma.table.create({
            data: { number, capacity }
        });
        response.json({ success: true, table });
    } catch (error) {
        response.status(500).json({ error: 'Error creating table' });
    }
};

//update table
export const updateTable = async (request, response) => {
    try {
        const { id } = request.params;
        const { number, capacity } = request.body;
        const table = await prisma.table.update({
            where: { id: id },
            data: { number, capacity }
        });
        response.json({ success: true, table });
    } catch (error) {
        response.status(500).json({ error: 'Error updating table from database' });
    }
};