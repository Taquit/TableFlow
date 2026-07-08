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
        const guest = await prisma.guest.findUnique({ where: { id: id } });
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
        const guest = await prisma.guest.delete({ where: { id: id } });
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
        const { name, email, phone } = request.body;
        const guest = await prisma.guest.create({ data: { name, email, phone } });
        response.json({ success: true, guest });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error creating guest' });
    }
}

//Update guest
export const updateGuest = async (request, response) => {
    try {
        const { id } = request.params;
        const { name, email, phone } = request.body;
        const guest = await prisma.guest.update({ where: { id: id }, data: { name, email, phone } });
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
        const guests = await prisma.guest.findMany({ where: { eventId: id } });
        response.json({ success: true, guests });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error fetching guests' });
    }
}

//Get guests by table id and event id 
export const getGuestsByTableIdAndEventId = async (request, response) => {

    try {
        const { tableId, eventId } = request.params;
        const guests = await prisma.guest.findMany({ where: { tableId: tableId, eventId: eventId } });
        response.json({ success: true, guests });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error fetching guests' });
    }

}