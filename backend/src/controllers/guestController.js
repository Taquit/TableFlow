import prisma from '../prisma.js';

//Get all guests
export const getAllGuests = async (request, response) => {
    try {
        const guests = await prisma.guest.findMany({ include: { table: true } });
        response.json({ success: true, guests });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error fetching guests' });
    }
}

//Get guest by id
export const getGuestById = async (request, response) => {
    try {
        const { id } = request.params;
        const guest = await prisma.guest.findUnique({ where: { id: parseInt(id) }, include: { table: true } });
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
        const guest = await prisma.guest.delete({ where: { id: parseInt(id) }, include: { table: true } });
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
        const { name, phone, eventId, tableId, paid, amountPaid } = request.body;
        const guestData = {
            name,
            phone,
            eventId: parseInt(eventId),
            tableId: tableId ? parseInt(tableId) : null,
            paid: paid === true || paid === 'true',
            amountPaid: amountPaid ? parseFloat(amountPaid) : 0.0
        };
        const guest = await prisma.guest.create({ data: guestData, include: { table: true } });
        response.json({ success: true, guest });
    } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, message: 'Error creating guest' });
    }
}

//Update guest
export const updateGuest = async (request, response) => {
    try {
        const { id } = request.params;
        const { name, phone, eventId, tableId, paid, amountPaid } = request.body;
        const dataToUpdate = { name, phone };
        if (eventId !== undefined) dataToUpdate.eventId = parseInt(eventId);
        if (tableId !== undefined) dataToUpdate.tableId = tableId === null ? null : parseInt(tableId);
        if (paid !== undefined) dataToUpdate.paid = paid === true || paid === 'true';
        if (amountPaid !== undefined) dataToUpdate.amountPaid = parseFloat(amountPaid);
        const guest = await prisma.guest.update({ where: { id: parseInt(id) }, data: dataToUpdate, include: { table: true } });
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
        const { eventId } = request.params;
        const guests = await prisma.guest.findMany({ where: { eventId: parseInt(eventId) }, include: { table: true } });
        response.json({ success: true, guests });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error fetching guests' });
    }
}

//Get guests by table id and event id 
export const getGuestsByTableIdAndEventId = async (request, response) => {

    try {
        const { tableId, eventId } = request.params;
        const guests = await prisma.guest.findMany({ where: { tableId: parseInt(tableId), eventId: parseInt(eventId) }, include: { table: true } });
        response.json({ success: true, guests });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error fetching guests' });
    }

}

//Get guest by name and event id
export const getGuestByNameAndEventId = async (request, response) => {
    try {
        const { name, eventId } = request.params;
        const guest = await prisma.guest.findMany({
            where: {
                eventId: parseInt(eventId),
                OR: [
                    { name: { contains: name, mode: 'insensitive' } },
                    { phone: { contains: name } }
                ]
            },
            include: { table: true }
        });
        response.json({ success: true, guest });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error fetching guest' });
    }
}
