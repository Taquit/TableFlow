import prisma from '../prisma.js';

//Get all guests
export const getAllGuests = async (request, response) => {
    try {
        const guests = await prisma.guest.findMany();
        response.json({ success: true, guests });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error fetching guests' });
    }
}

//Get guest by id
export const getGuestById = async (request, response) => {
    try {
        const { id } = request.params;
        const guest = await prisma.guest.findUnique({ where: { id: parseInt(id) } });
        if (!guest) {
            return response.status(404).json({ success: false, message: 'Guest not found' });
        }
        response.json({ success: true, guest });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error fetching guest' });
    }
}

//Delete guest by id
export const deleteGuestById = async (request, response) => {
    try {
        const { id } = request.params;
        const guest = await prisma.guest.delete({ where: { id: parseInt(id) } });
        if (!guest) {
            return response.status(404).json({ success: false, message: 'Guest not found' });
        }
        response.json({ success: true, guest });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error deleting guest' });
    }
}

//Create guest
export const createGuest = async (request, response) => {
    try {
        const { name, email, phone, eventId, tableId } = request.body;
        const guest = await prisma.guest.create({ data: { name, email, phone, eventId: parseInt(eventId), tableId: tableId ? parseInt(tableId) : null } });
        response.json({ success: true, guest });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error creating guest' });
    }
}

//Update guest
export const updateGuest = async (request, response) => {
    try {
        const { id } = request.params;
        const { name, email, phone, eventId, tableId } = request.body;
        const dataToUpdate = { name, email, phone };
        if (eventId) dataToUpdate.eventId = parseInt(eventId);
        if (tableId) dataToUpdate.tableId = parseInt(tableId);
        const guest = await prisma.guest.update({ where: { id: parseInt(id) }, data: dataToUpdate });
        if (!guest) {
            return response.status(404).json({ success: false, message: 'Guest not found' });
        }
        response.json({ success: true, guest });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error updating guest' });
    }
}

//Get guests by event id
export const getGuestsByEventId = async (request, response) => {
    try {
        const { id } = request.params;
        const guests = await prisma.guest.findMany({ where: { eventId: parseInt(id) } });
        response.json({ success: true, guests });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error fetching guests' });
    }
}

//Get guests by table id and event id 
export const getGuestsByTableIdAndEventId = async (request, response) => {

    try {
        const { tableId, eventId } = request.params;
        const guests = await prisma.guest.findMany({ where: { tableId: parseInt(tableId), eventId: parseInt(eventId) } });
        response.json({ success: true, guests });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error fetching guests' });
    }

}