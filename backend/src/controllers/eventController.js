import prisma from '../prisma.js';

//Get all events
export const getAllEvents = async (request, response) => {
    try {
        const events = await prisma.event.findMany();
        response.json({ succes: true, events });
    } catch (error) {
        response.status(500).json({ success: false, error: 'Error fetching events from database' })
    }
}

//Get event by id
export const getEventById = async (request, response) => {
    try {
        const { id } = request.params;
        const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });
        if (!event) {
            response.status(404).json({ success: false, error: 'Event not found' });
            return;
        }
        response.json({ success: true, event });
    } catch (error) {
        response.status(500).json({ success: false, error: 'Error fetching event from database' });
    }
};

//Delet event
export const deletEventById = async (request, response) => {
    try {
        const { id } = request.params;
        const event = await prisma.event.delete({ where: { id: parseInt(id) } });
        if (!event) {
            response.status(404).json({ success: false, error: 'Event not found' });
            return;
        }
        response.json({ success: true, event });
    } catch (error) {
        response.status(500).json({ success: false, error: 'Error deleting event from database' });
    }
};

//Create event
export const createEvent = async (request, response) => {
    try {
        const { name, date, time, location, numTable, numGuest } = request.body;
        const dateTimeString = time ? `${date}T${time}:00` : `${date}T00:00:00`;
        const eventDate = new Date(dateTimeString);
        
        const dataPayload = { eventName: name, date: eventDate, location };
        const parsedNumTable = numTable !== undefined && numTable !== '' ? parseInt(numTable) : 0;
        const parsedNumGuest = numGuest !== undefined && numGuest !== '' ? parseInt(numGuest) : 0;

        dataPayload.numTable = parsedNumTable;
        dataPayload.numGuest = parsedNumGuest;

        const tablesToCreate = [];
        if (parsedNumTable > 0) {
            const hasGuests = parsedNumGuest > 0;
            const baseSeats = hasGuests ? Math.floor(parsedNumGuest / parsedNumTable) : 8; // 8 es el default del esquema
            const remainder = hasGuests ? parsedNumGuest % parsedNumTable : 0;

            for (let i = 1; i <= parsedNumTable; i++) {
                const seats = i <= remainder ? baseSeats + 1 : baseSeats;
                tablesToCreate.push({ number: i, numSeats: seats });
            }
        }

        if (tablesToCreate.length > 0) {
            dataPayload.tables = {
                create: tablesToCreate
            };
        }

        const event = await prisma.event.create({ 
            data: dataPayload,
            include: {
                tables: true
            }
        });
        response.json({ success: true, event });
    } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, error: 'Error creating event from database' });
    }
};

//Update event
export const updateEvent = async (request, response) => {
    try {
        const { id } = request.params;
        const { name, date, time, location, numTable, numGuest } = request.body;
        const dateTimeString = time ? `${date}T${time}:00` : `${date}T00:00:00`;
        const eventDate = new Date(dateTimeString);

        const dataPayload = { eventName: name, date: eventDate, location };
        if (numTable !== undefined && numTable !== '') dataPayload.numTable = parseInt(numTable);
        if (numGuest !== undefined && numGuest !== '') dataPayload.numGuest = parseInt(numGuest);

        const event = await prisma.event.update({ 
            where: { id: parseInt(id) }, 
            data: dataPayload 
        });
        if (!event) {
            response.status(404).json({ success: false, error: 'Event not found' });
            return;
        }
        response.json({ success: true, event });
    } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, error: 'Error updating event from database' });
    }
};

